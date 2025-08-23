"use client"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Send, Bot, User, Loader2, ChevronRight, Sparkles, Copy, Check, RefreshCw, Trash2 } from "lucide-react"

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const MAX_MESSAGES = 10 // 최대 메시지 개수 제한

interface AIAssistantProps {
  currentDesignCode: Record<string, unknown>
  onApplyChanges: (newConfig: Record<string, unknown>) => void
  templateType: string
  isExpanded: boolean
  onToggleExpanded: (expanded: boolean) => void
}

export default function AIAssistant({ currentDesignCode, onApplyChanges, templateType, isExpanded, onToggleExpanded }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `안녕하세요! 저는 ${templateType} 디자인 전문 어시스턴트입니다. ✨\n\n다음과 같은 요청을 도와드릴 수 있어요:\n• 색상 변경 ("배경을 파란색으로 바꿔줘")\n• 텍스트 수정 ("제목을 더 크게 만들어줘")\n• 레이아웃 조정 ("미니멀하게 바꿔줘")\n• 효과 추가 ("그라데이션 배경으로 해줘")\n\n어떤 변경을 원하시나요?"`,
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const callClaudeAPI = async (prompt: string) => {
    // 현재 설정에서 중요한 필드만 추출
    const simplifiedConfig = Object.keys(currentDesignCode).reduce((acc, key) => {
      const value = currentDesignCode[key]
      // 긴 텍스트는 처음 50자만 포함
      if (typeof value === 'string' && value.length > 50) {
        acc[key] = value.substring(0, 50) + '...'
      } else {
        acc[key] = value
      }
      return acc
    }, {} as Record<string, unknown>)

    const systemPrompt = `You are a friendly thumbnail design assistant for ${templateType} template.
Available config keys: ${Object.keys(currentDesignCode).join(', ')}

Your task:
1. Understand the user's design request in Korean
2. Modify the config appropriately 
3. Respond with TWO parts:
   - A friendly Korean explanation of what you changed
   - The complete updated JSON config

Format your response like this:
[설명] 배경색을 파란색으로 변경했습니다.
[JSON] {"bgColor": "#3B82F6", ...}

Be conversational and helpful in Korean!`

    // 대화 히스토리 준비 (최근 3개 메시지만)
    const conversationHistory = messages.slice(-3).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    }))

    try {
      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          max_tokens: 3000,
          temperature: 0.7,
          system: systemPrompt,
          messages: [
            ...conversationHistory,
            {
              role: 'user',
              content: `Current config: ${JSON.stringify(simplifiedConfig)}

User request: ${prompt}

Please respond with both explanation and updated config as specified in the format above.`
            }
          ]
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'API request failed')
      }

      const data = await response.json()
      return data.content[0].text
    } catch (error) {
      console.error('Claude API Error:', error)
      throw error
    }
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => {
      const newMessages = [...prev, userMessage]
      // 메시지가 너무 많으면 오래된 것부터 제거
      if (newMessages.length > MAX_MESSAGES) {
        return newMessages.slice(-MAX_MESSAGES)
      }
      return newMessages
    })
    setInput('')
    setIsLoading(true)

    try {
      const response = await callClaudeAPI(input.trim())
      
      // 설명과 JSON 부분 분리
      const explanationMatch = response.match(/\[설명\]\s*([\s\S]*?)(?=\[JSON\]|$)/)
      const jsonMatch = response.match(/\[JSON\]\s*(\{[\s\S]*?\})/) || response.match(/(\{[\s\S]*?\})/)
      
      let explanation = '디자인을 수정했습니다!'
      let newConfig
      
      if (explanationMatch) {
        explanation = explanationMatch[1].trim()
      }
      
      if (jsonMatch) {
        try {
          newConfig = JSON.parse(jsonMatch[1] || jsonMatch[0])
          
          const assistantMessage: Message = {
            role: 'assistant',
            content: explanation,
            timestamp: new Date()
          }
          
          setMessages(prev => {
            const newMessages = [...prev, assistantMessage]
            if (newMessages.length > MAX_MESSAGES) {
              return newMessages.slice(-MAX_MESSAGES)
            }
            return newMessages
          })
          
          // 변경사항 적용
          onApplyChanges(newConfig)
        } catch (error) {
          console.error('Parse error:', error)
          throw new Error('설정을 적용할 수 없습니다. 다시 시도해주세요.')
        }
      } else {
        // JSON이 없는 경우 일반 대화로 처리
        const assistantMessage: Message = {
          role: 'assistant',
          content: response,
          timestamp: new Date()
        }
        
        setMessages(prev => {
          const newMessages = [...prev, assistantMessage]
          if (newMessages.length > MAX_MESSAGES) {
            return newMessages.slice(-MAX_MESSAGES)
          }
          return newMessages
        })
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : '알 수 없는 오류'
      const errorMessage: Message = {
        role: 'assistant',
        content: `죄송합니다. 오류가 발생했습니다: ${errorMsg}`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const resetConversation = () => {
    setMessages([
      {
        role: 'assistant',
        content: `안녕하세요! 저는 ${templateType} 디자인 전문 어시스턴트입니다. ✨

다음과 같은 요청을 도와드릴 수 있어요:
• 색상 변경 ("배경을 파란색으로 바꿔줘")
• 텍스트 수정 ("제목을 더 크게 만들어줘")
• 레이아웃 조정 ("미니멀하게 바꿔줘")
• 효과 추가 ("그라데이션 배경으로 해줘")

어떤 변경을 원하시나요?`,
        timestamp: new Date()
      }
    ])
  }

  const getTemplateSuggestedPrompts = () => {
    const basePrompts = [
      "배경을 그라데이션으로 바꿔줘",
      "색상을 좀 더 밝게 해줘",
      "모던한 느낌으로 변경해줘"
    ]
    
    const templateSpecificPrompts: Record<string, string[]> = {
      'YouTube': ["썸네일을 더 자극적으로 만들어줘", "조회수를 강조해줘"],
      'Instagram': ["스퀘어 비율로 바꿔줘", "좀 더 트렌디하게 해줘"],
      '상품 상세': ["CTA 버튼을 더 눈에 띄게 해줘", "혜택을 강조해줘"],
      'IT 서비스': ["전문적인 느낌으로 바꿔줘", "기술적인 이미지를 추가해줘"],
      '디자인 서비스': ["포트폴리오 스타일로 바꿔줘", "창의적인 느낌으로 해줘"],
      '4컷만화': ["말풍선을 더 크게 해줘", "캐릭터를 더 귀엽게 해줘"]
    }
    
    const specific = templateSpecificPrompts[templateType] || []
    return [...basePrompts, ...specific].slice(0, 6)
  }

  const suggestedPrompts = getTemplateSuggestedPrompts()

  if (!isExpanded) {
    return (
      <Button
        onClick={() => onToggleExpanded(true)}
        className="fixed right-4 bottom-4 z-50 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full shadow-lg"
        size="lg"
      >
        <Bot className="w-5 h-5 mr-2" />
        AI 어시스턴트
      </Button>
    )
  }

  return (
    <div className="fixed right-0 top-0 h-screen w-96 z-50">
      {/* 메인 패널 */}
      <Card className="h-full rounded-none border-l shadow-2xl flex flex-col bg-white/95 backdrop-blur-sm">
        {/* 헤더 */}
        <div className="p-4 border-b bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                <h2 className="font-bold">AI 디자인 어시스턴트</h2>
                <Sparkles className="w-4 h-4" />
              </div>
              <p className="text-xs mt-1 opacity-90">{templateType} 전용 AI</p>
            </div>
            <div className="flex items-center gap-1">
              <Button
                onClick={resetConversation}
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20"
                title="대화 초기화"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => onToggleExpanded(false)}
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* 메시지 영역 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-3 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString('ko-KR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  {message.role === 'assistant' && (
                    <button
                      onClick={() => copyToClipboard(message.content, index)}
                      className="text-xs opacity-70 hover:opacity-100 transition-opacity"
                    >
                      {copiedIndex === index ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  )}
                </div>
              </div>
              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <Loader2 className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-100 rounded-lg p-3">
                <p className="text-sm text-gray-600">생각하는 중...</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 추천 프롬프트 */}
        {messages.length === 1 && (
          <div className="px-4 pb-2">
            <p className="text-xs text-gray-500 mb-2">추천 요청:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => setInput(prompt)}
                  className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 입력 영역 */}
        <div className="p-4 border-t bg-gray-50/50">
          <div className="flex gap-2 items-end">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => {
                  const value = e.target.value
                  if (value.length <= 500) {
                    setInput(value)
                    // 자동 높이 조절
                    const textarea = e.target as HTMLTextAreaElement
                    textarea.style.height = 'auto'
                    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
                  }
                }}
                onKeyDown={handleKeyDown}
                placeholder="예: '배경을 파란색으로 바꿔줘' 또는 '제목을 더 크게 해줘'"
                className="w-full px-3 py-2 border rounded-lg resize-none text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[40px] max-h-[120px]"
                rows={1}
                disabled={isLoading}
                style={{ height: 'auto' }}
              />
              {input.trim() && (
                <Button
                  onClick={() => setInput('')}
                  size="sm"
                  variant="ghost"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              )}
            </div>
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white h-10 w-10 p-0"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-gray-500">
              Enter로 전송 • Shift+Enter로 줄바꿈
            </p>
            <p className="text-xs text-gray-400">
              {input.length}/500
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
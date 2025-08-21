"use client"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Send, Bot, User, Loader2, ChevronRight, ChevronLeft, Sparkles, Copy, Check } from "lucide-react"

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface AIAssistantProps {
  currentDesignCode: any
  onApplyChanges: (newConfig: any) => void
  templateType: string
  isExpanded: boolean
  onToggleExpanded: (expanded: boolean) => void
}

export default function AIAssistant({ currentDesignCode, onApplyChanges, templateType, isExpanded, onToggleExpanded }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `안녕하세요! 저는 ${templateType} 템플릿 디자인 어시스턴트입니다. 원하시는 디자인 변경사항을 말씀해주세요. 예: "배경을 파란색으로 변경해줘", "제목을 더 크게 만들어줘"`,
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
    const systemPrompt = `You are a design assistant for a thumbnail generator application powered by Claude 4 Sonnet. 
You help users modify their thumbnail designs by understanding their requests and generating updated configuration objects.

Current template type: ${templateType}
Current configuration: ${JSON.stringify(currentDesignCode, null, 2)}

Based on the user's request, modify the configuration object and return ONLY the updated configuration as valid JSON.
Do not include any explanations or markdown - just the raw JSON object.

Common modifications users might request:
- Change colors (bgColor, textColor, accentColor, bgGradientStart, bgGradientEnd, etc.)
- Change text content (mainTitle, subtitle, mainText, subText, etc.)
- Toggle visibility of elements (showBadge, showTimer, showEmoji, showProcess, etc.)
- Change sizes and fonts (fontSize, fontWeight, fontFamily)
- Modify layout options (bgType, theme, alignment, etc.)
- Update specific template features based on the template type

Use your advanced Claude 4 reasoning to understand context and make intelligent design decisions.
Respond in Korean when explaining what you changed, but keep the JSON keys in English.`

    try {
      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          max_tokens: 2000,
          temperature: 0.7,
          system: systemPrompt,
          messages: [
            {
              role: 'user',
              content: prompt
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

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await callClaudeAPI(input.trim())
      
      // JSON 부분만 추출
      let jsonMatch = response.match(/\{[\s\S]*\}/);
      let newConfig;
      
      if (jsonMatch) {
        try {
          newConfig = JSON.parse(jsonMatch[0])
          
          const assistantMessage: Message = {
            role: 'assistant',
            content: '디자인을 수정했습니다. 변경사항이 화면에 반영되었습니다.',
            timestamp: new Date()
          }
          setMessages(prev => [...prev, assistantMessage])
          
          // 변경사항 적용
          onApplyChanges(newConfig)
        } catch (parseError) {
          throw new Error('응답을 파싱할 수 없습니다.')
        }
      } else {
        throw new Error('유효한 설정을 생성할 수 없습니다.')
      }
    } catch (error: any) {
      const errorMessage: Message = {
        role: 'assistant',
        content: `죄송합니다. 오류가 발생했습니다: ${error.message}`,
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

  const suggestedPrompts = [
    "배경을 그라데이션으로 변경해줘",
    "텍스트를 더 크게 만들어줘",
    "색상을 좀 더 밝게 바꿔줘",
    "미니멀한 스타일로 변경해줘"
  ]

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
                <Sparkles className="w-4 h-4 animate-pulse" />
              </div>
              <p className="text-xs mt-1 opacity-90">Claude 4 Sonnet (2025.05)</p>
            </div>
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
                <Loader2 className="w-4 h-4 text-white animate-spin" />
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
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="디자인 변경 요청을 입력하세요..."
              className="flex-1 px-3 py-2 border rounded-lg resize-none text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={2}
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              size="sm"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Shift + Enter로 줄바꿈
          </p>
        </div>
      </Card>
    </div>
  )
}
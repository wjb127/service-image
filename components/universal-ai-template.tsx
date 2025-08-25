"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Upload, Eye, Code, RefreshCw, Wand2 } from "lucide-react"
import { toPng } from "html-to-image"
import { useRef, useState, useEffect } from "react"
import AIAssistant from "@/components/ai-assistant"
import Watermark from "@/components/watermark"

interface UniversalAITemplateProps {
  templateType: string
  defaultTemplate: React.ReactNode
  TemplateComponent: React.ComponentType<any>
  templateProps?: Record<string, any>
}

export default function UniversalAITemplate({ 
  templateType, 
  defaultTemplate,
  TemplateComponent,
  templateProps = {}
}: UniversalAITemplateProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [showCode, setShowCode] = useState(false)
  const [isAssistantExpanded, setIsAssistantExpanded] = useState(false)
  const [aiMode, setAIMode] = useState<'config' | 'html'>('config')
  const [showWatermark, setShowWatermark] = useState(true)
  const [watermarkText, setWatermarkText] = useState('service-image.vercel.app')
  
  // HTML 모드를 위한 상태
  const [currentHTML, setCurrentHTML] = useState('')
  
  // 설정 모드를 위한 상태
  const [configMode, setConfigMode] = useState(true)

  // 기본 HTML 생성 함수
  const generateDefaultHTML = () => {
    const templates: Record<string, string> = {
      'IT 서비스': `
        <div style="width: 1200px; height: 675px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 60px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; position: relative;">
          <h1 style="font-size: 4rem; font-weight: 800; color: white; margin-bottom: 1rem; text-align: center;">
            랜딩페이지 제작<br>전문 서비스
          </h1>
          <p style="font-size: 1.5rem; color: rgba(255,255,255,0.9); text-align: center;">
            AI가 만드는 완벽한 디자인
          </p>
        </div>
      `,
      'YouTube': `
        <div style="width: 1200px; height: 675px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); display: flex; justify-content: center; align-items: center; position: relative; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <div style="text-align: center;">
            <h1 style="font-size: 5rem; font-weight: 900; color: white; margin-bottom: 1rem; text-shadow: 3px 3px 6px rgba(0,0,0,0.3);">
              🎬 YOUTUBE<br>THUMBNAIL
            </h1>
            <p style="font-size: 2rem; color: white; font-weight: 600;">
              조회수 폭발! 클릭률 최고!
            </p>
          </div>
        </div>
      `,
      'Instagram': `
        <div style="width: 1080px; height: 1080px; background: linear-gradient(45deg, #405de6, #5851db, #833ab4, #c13584, #e1306c, #fd1d1d); display: flex; justify-content: center; align-items: center; padding: 80px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <div style="background: white; border-radius: 30px; padding: 60px; text-align: center; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
            <h1 style="font-size: 3rem; font-weight: 800; background: linear-gradient(45deg, #833ab4, #e1306c); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 1rem;">
              INSTAGRAM<br>PERFECT POST
            </h1>
            <p style="font-size: 1.3rem; color: #333;">
              인스타그램 피드를 빛나게!
            </p>
          </div>
        </div>
      `,
      '제품 상세': `
        <div style="width: 1200px; height: 675px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; padding: 60px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <div style="flex: 1;">
            <h1 style="font-size: 3.5rem; font-weight: 800; color: white; margin-bottom: 1rem;">
              혁신적인 제품
            </h1>
            <p style="font-size: 1.5rem; color: rgba(255,255,255,0.9); margin-bottom: 2rem;">
              당신의 일상을 바꿀 특별한 경험
            </p>
            <div style="display: flex; gap: 1rem;">
              <button style="background: white; color: #667eea; padding: 1rem 2rem; border-radius: 10px; font-size: 1.1rem; font-weight: 600; border: none;">
                구매하기
              </button>
              <button style="background: transparent; color: white; padding: 1rem 2rem; border-radius: 10px; font-size: 1.1rem; font-weight: 600; border: 2px solid white;">
                자세히 보기
              </button>
            </div>
          </div>
          <div style="flex: 1; display: flex; justify-content: center;">
            <div style="width: 300px; height: 300px; background: rgba(255,255,255,0.2); border-radius: 20px; display: flex; align-items: center; justify-content: center;">
              <span style="font-size: 5rem;">📦</span>
            </div>
          </div>
        </div>
      `,
      '디자인 서비스': `
        <div style="width: 1200px; height: 675px; background: linear-gradient(135deg, #FA8BFF 0%, #2BD2FF 52%, #2BFF88 90%); display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 60px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <h1 style="font-size: 4.5rem; font-weight: 900; color: white; text-shadow: 3px 3px 10px rgba(0,0,0,0.2); margin-bottom: 1rem; text-align: center;">
            ✨ DESIGN<br>STUDIO
          </h1>
          <p style="font-size: 1.8rem; color: white; text-shadow: 2px 2px 4px rgba(0,0,0,0.1); text-align: center;">
            창의적인 디자인, 완벽한 솔루션
          </p>
        </div>
      `,
      '코믹': `
        <div style="width: 1200px; height: 675px; background: #FFE66D; display: flex; justify-content: center; align-items: center; padding: 60px; font-family: 'Comic Sans MS', cursive; position: relative;">
          <div style="background: white; border: 4px solid #000; border-radius: 20px; padding: 40px; box-shadow: 10px 10px 0 #000; transform: rotate(-2deg);">
            <h1 style="font-size: 3rem; font-weight: 900; color: #FF6B6B; margin-bottom: 1rem; text-align: center;">
              BAM! 💥<br>COMIC STYLE
            </h1>
            <p style="font-size: 1.5rem; color: #4ECDC4; font-weight: 600; text-align: center;">
              POW! AWESOME! WOW!
            </p>
          </div>
          <div style="position: absolute; top: 50px; right: 100px; font-size: 2rem; transform: rotate(15deg);">💬</div>
          <div style="position: absolute; bottom: 50px; left: 100px; font-size: 3rem; transform: rotate(-15deg);">⚡</div>
        </div>
      `
    }
    
    return templates[templateType] || templates['IT 서비스']
  }

  useEffect(() => {
    if (aiMode === 'html' && !currentHTML) {
      setCurrentHTML(generateDefaultHTML())
    }
  }, [aiMode, templateType])

  const downloadImage = async () => {
    if (!cardRef.current) return
    
    setIsDownloading(true)
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: 'white'
      })
      
      const link = document.createElement('a')
      link.download = `${templateType.toLowerCase().replace(/\s+/g, '-')}-thumbnail.png`
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error('Failed to generate image:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  const handleAIChanges = (newConfig: Record<string, unknown>) => {
    if (aiMode === 'html' && newConfig.html && typeof newConfig.html === 'string') {
      setCurrentHTML(newConfig.html)
    }
  }

  const getCurrentDesignCode = () => {
    if (aiMode === 'html') {
      return {
        html: currentHTML,
        type: 'html-direct',
        editableElements: ['everything']
      }
    } else {
      return {
        type: 'config-based',
        templateType
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold mb-2">{templateType} 템플릿</h1>
          <p className="text-gray-600">
            AI가 모든 디자인 요소를 완벽하게 제어합니다
          </p>
        </div>

        {/* 컨트롤 버튼들 */}
        <div className="mb-6 flex gap-4 justify-center flex-wrap">
          <div className="flex gap-2 bg-white rounded-lg p-1 shadow-sm">
            <Button
              onClick={() => setAIMode('config')}
              variant={aiMode === 'config' ? 'default' : 'outline'}
              size="sm"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              설정 모드
            </Button>
            <Button
              onClick={() => setAIMode('html')}
              variant={aiMode === 'html' ? 'default' : 'outline'}
              size="sm"
            >
              <Code className="w-4 h-4 mr-2" />
              AI 완전제어
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={downloadImage} disabled={isDownloading}>
              <Download className="w-4 h-4 mr-2" />
              {isDownloading ? '생성 중...' : 'PNG 다운로드'}
            </Button>
            
            {aiMode === 'html' && (
              <>
                <Button
                  onClick={() => setShowCode(!showCode)}
                  variant="outline"
                >
                  {showCode ? <Eye className="w-4 h-4 mr-2" /> : <Code className="w-4 h-4 mr-2" />}
                  {showCode ? '미리보기' : 'HTML 보기'}
                </Button>
                <Button
                  onClick={() => setCurrentHTML(generateDefaultHTML())}
                  variant="outline"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  초기화
                </Button>
              </>
            )}
          </div>
          
          <div className="flex gap-2 items-center">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showWatermark}
                onChange={(e) => setShowWatermark(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">워터마크</span>
            </label>
            {showWatermark && (
              <input
                type="text"
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                placeholder="워터마크 텍스트"
                className="px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 w-32"
              />
            )}
          </div>
        </div>

        {/* 템플릿 렌더링 */}
        {aiMode === 'config' ? (
          // 기존 템플릿 컴포넌트 사용
          <div className="flex justify-center">
            <div className="relative">
              <TemplateComponent {...templateProps} />
            </div>
          </div>
        ) : (
          // AI 완전제어 모드
          !showCode ? (
            <div className="flex justify-center">
              <Card 
                ref={cardRef}
                className="overflow-hidden shadow-2xl border-0 relative"
                style={{ display: 'inline-block' }}
              >
                <div 
                  dangerouslySetInnerHTML={{ __html: currentHTML }}
                  style={{ display: 'block' }}
                />
                {showWatermark && (
                  <Watermark 
                    position="bottom-right" 
                    opacity={0.6} 
                    size="small"
                    text={watermarkText}
                  />
                )}
              </Card>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">생성된 HTML/CSS 코드</h3>
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto text-sm max-h-96">
                  <code>{currentHTML}</code>
                </pre>
                <div className="mt-4 flex gap-2">
                  <Button
                    onClick={() => navigator.clipboard.writeText(currentHTML)}
                    size="sm"
                  >
                    클립보드에 복사
                  </Button>
                  <Button
                    onClick={() => {
                      const blob = new Blob([currentHTML], { type: 'text/html' })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = `${templateType.toLowerCase().replace(/\s+/g, '-')}.html`
                      a.click()
                      URL.revokeObjectURL(url)
                    }}
                    size="sm"
                    variant="outline"
                  >
                    HTML 파일 다운로드
                  </Button>
                </div>
              </Card>
            </div>
          )
        )}

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            💡 <strong>AI 완전제어 모드:</strong> AI에게 어떤 디자인 변경이든 요청하세요!<br/>
            "제목을 왼쪽 정렬해줘", "버튼을 더 크게", "배경색을 바꿔줘" 등 모든 요청이 가능합니다.
          </p>
        </div>
      </div>

      <AIAssistant
        currentDesignCode={getCurrentDesignCode()}
        onApplyChanges={handleAIChanges}
        templateType={`${templateType} (${aiMode === 'html' ? 'AI 완전제어' : '설정 모드'})`}
        isExpanded={isAssistantExpanded}
        onToggleExpanded={setIsAssistantExpanded}
      />
    </div>
  )
}
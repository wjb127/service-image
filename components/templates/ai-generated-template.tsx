"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Upload, Eye, Code } from "lucide-react"
import { toPng } from "html-to-image"
import { useRef, useState } from "react"
import AIAssistant from "@/components/ai-assistant"

interface AIGeneratedTemplateProps {
  initialHTML?: string
}

export default function AIGeneratedTemplate({ initialHTML }: AIGeneratedTemplateProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [showCode, setShowCode] = useState(false)
  const [isAssistantExpanded, setIsAssistantExpanded] = useState(false)
  const [currentHTML, setCurrentHTML] = useState(initialHTML || `
    <div style="
      width: 1200px;
      height: 675px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 60px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      position: relative;
      overflow: hidden;
    ">
      <!-- 배경 패턴 -->
      <div style="
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%);
        pointer-events: none;
      "></div>
      
      <!-- 메인 콘텐츠 -->
      <div style="
        text-align: center;
        z-index: 2;
        max-width: 800px;
      ">
        <h1 style="
          font-size: 4rem;
          font-weight: 800;
          color: white;
          margin-bottom: 1rem;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          line-height: 1.1;
        ">
          AI가 만드는<br>완벽한 디자인
        </h1>
        
        <p style="
          font-size: 1.5rem;
          color: rgba(255,255,255,0.9);
          margin-bottom: 2rem;
          font-weight: 300;
          line-height: 1.4;
        ">
          이제 모든 요소를 자유자재로 조정할 수 있습니다
        </p>
        
        <div style="
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        ">
          <button style="
            background: rgba(255,255,255,0.2);
            border: 2px solid rgba(255,255,255,0.3);
            color: white;
            padding: 1rem 2rem;
            border-radius: 50px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
          ">
            시작하기
          </button>
          
          <button style="
            background: transparent;
            border: 2px solid rgba(255,255,255,0.5);
            color: white;
            padding: 1rem 2rem;
            border-radius: 50px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
          ">
            더 알아보기
          </button>
        </div>
      </div>
      
      <!-- 장식 요소 -->
      <div style="
        position: absolute;
        bottom: 2rem;
        right: 2rem;
        width: 100px;
        height: 100px;
        background: rgba(255,255,255,0.1);
        border-radius: 50%;
        backdrop-filter: blur(10px);
      "></div>
      
      <div style="
        position: absolute;
        top: 2rem;
        left: 2rem;
        width: 60px;
        height: 60px;
        background: rgba(255,255,255,0.15);
        border-radius: 15px;
        backdrop-filter: blur(10px);
        transform: rotate(45deg);
      "></div>
    </div>
  `)

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
      link.download = 'ai-generated-thumbnail.png'
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error('Failed to generate image:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  const uploadImage = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = () => {
          // const imageUrl = e.target?.result as string
          // AI에게 이미지를 배경으로 사용하도록 요청할 수 있음 (향후 구현)
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  const handleAIChanges = (newConfig: Record<string, unknown>) => {
    // AI가 HTML을 직접 생성해서 전달
    if (newConfig.html && typeof newConfig.html === 'string') {
      setCurrentHTML(newConfig.html)
    }
  }

  // AI가 현재 HTML을 분석할 수 있도록 제공
  const getCurrentDesignCode = () => {
    return {
      html: currentHTML,
      type: 'html-direct',
      editableElements: [
        'title', 'subtitle', 'buttons', 'colors', 'layout', 'fonts', 'spacing', 'effects'
      ]
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold mb-2">AI HTML 생성 템플릿</h1>
          <p className="text-gray-600">
            AI가 HTML/CSS를 직접 생성하여 모든 디자인 요소를 완벽하게 제어합니다
          </p>
        </div>

        <div className="mb-6 flex gap-4 justify-center">
          <Button onClick={downloadImage} disabled={isDownloading}>
            <Download className="w-4 h-4 mr-2" />
            {isDownloading ? '생성 중...' : 'PNG 다운로드'}
          </Button>
          <Button onClick={uploadImage} variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            이미지 업로드
          </Button>
          <Button
            onClick={() => setShowCode(!showCode)}
            variant="outline"
          >
            {showCode ? <Eye className="w-4 h-4 mr-2" /> : <Code className="w-4 h-4 mr-2" />}
            {showCode ? '미리보기' : 'HTML 보기'}
          </Button>
        </div>

        {!showCode ? (
          <div className="flex justify-center">
            <Card 
              ref={cardRef}
              className="overflow-hidden shadow-2xl border-0"
              style={{ display: 'inline-block' }}
            >
              <div 
                dangerouslySetInnerHTML={{ __html: currentHTML }}
                style={{ display: 'block' }}
              />
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
                    a.download = 'ai-generated.html'
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
        )}

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            💡 <strong>AI 어시스턴트 사용법:</strong><br/>
            &quot;제목을 왼쪽 정렬해줘&quot;, &quot;버튼을 더 크게 만들어줘&quot;, &quot;배경을 그라데이션으로 바꿔줘&quot; 등<br/>
            모든 디자인 요소를 자유롭게 요청하세요!
          </p>
        </div>
      </div>

      <AIAssistant
        currentDesignCode={getCurrentDesignCode()}
        onApplyChanges={handleAIChanges}
        templateType="AI HTML 생성"
        isExpanded={isAssistantExpanded}
        onToggleExpanded={setIsAssistantExpanded}
      />
    </div>
  )
}
"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Settings, Palette, Brush, PenTool, Layers, Sparkles, Award, ArrowRight, Zap } from "lucide-react"
import { toPng } from "html-to-image"
import { useRef, useState } from "react"

interface DesignConfig {
  mainTitle: string
  subtitle: string
  clientText: string
  processSteps: string[]
  portfolioCount: string
  showPortfolio: boolean
  showColorPalette: boolean
  showProcess: boolean
  showClients: boolean
  showStats: boolean
  showTools: boolean
  bgColor: string
  textColor: string
  accentColor: string
  fontSize: string
  fontFamily: string
}

const defaultConfig: DesignConfig = {
  mainTitle: "창의적인 디자인으로\n브랜드를 빛내드립니다",
  subtitle: "UI/UX · 브랜딩 · 웹디자인",
  clientText: "500+ 클라이언트 만족",
  processSteps: ["기획", "디자인", "피드백", "완성"],
  portfolioCount: "1,234",
  showPortfolio: true,
  showColorPalette: true,
  showProcess: true,
  showClients: false,
  showStats: true,
  showTools: true,
  bgColor: "bg-gradient-to-br from-purple-100 to-pink-100",
  textColor: "text-gray-900",
  accentColor: "bg-purple-600",
  fontSize: "text-5xl",
  fontFamily: "pretendard"
}

export default function DesignServiceTemplate() {
  const cardRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [config, setConfig] = useState<DesignConfig>(defaultConfig)
  const [customBgImage, setCustomBgImage] = useState<string | null>(null)
  const [showControls, setShowControls] = useState(false)

  const handleImageUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setCustomBgImage(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDownload = async () => {
    if (!cardRef.current) return
    
    setIsDownloading(true)
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 0.95,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        skipFonts: true,
        filter: (node) => {
          if (node.tagName === 'LINK' && node.getAttribute('rel') === 'stylesheet') {
            return false
          }
          return true
        }
      })
      
      const link = document.createElement('a')
      link.download = `design-service-${Date.now()}.png`
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error('Failed to generate image:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  const updateConfig = (key: keyof DesignConfig, value: string | boolean | string[]) => {
    setConfig({ ...config, [key]: value })
  }

  return (
    <div className="flex h-[calc(100vh-12rem)]">
      {/* Main content area */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
        <div className="w-full max-w-4xl space-y-4">
          {/* 간단한 컨트롤 버튼들 */}
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button
                onClick={() => setConfig({...config, bgColor: 'bg-gradient-to-br from-purple-100 to-pink-100', textColor: 'text-gray-900'})}
                variant="outline"
                className="px-3 py-2 text-sm"
              >
                파스텔 톤
              </Button>
              <Button
                onClick={() => setConfig({...config, bgColor: 'bg-black', textColor: 'text-white'})}
                variant="outline"
                className="px-3 py-2 text-sm"
              >
                다크 모드
              </Button>
              <Button
                onClick={() => setConfig({...config, bgColor: 'bg-gradient-to-br from-yellow-400 to-orange-500', textColor: 'text-white'})}
                variant="outline"
                className="px-3 py-2 text-sm"
              >
                비비드 컬러
              </Button>
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="px-3 py-2 text-sm"
              >
                배경 이미지
              </Button>
            </div>
            <Button
              onClick={() => setShowControls(!showControls)}
              variant="outline"
              className="px-3 py-2 text-sm"
            >
              <Settings className="w-4 h-4 mr-2" />
              컨트롤 {showControls ? '숨기기' : '보기'}
            </Button>
          </div>
          
          {/* 숨겨진 파일 입력 */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleImageUpload(file)
            }}
            className="hidden"
          />

          {/* 디자인 서비스 썸네일 카드 (16:9) */}
          <Card 
            ref={cardRef} 
            className={`relative w-full aspect-[16/9] ${customBgImage ? '' : config.bgColor} overflow-hidden`}
            style={customBgImage ? {
              backgroundImage: `url(${customBgImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            } : {}}
          >
            {/* 커스텀 배경 이미지일 때 오버레이 */}
            {customBgImage && (
              <div className="absolute inset-0 bg-black/20" />
            )}

            {/* 포트폴리오 그리드 */}
            {config.showPortfolio && (
              <div className="absolute top-4 right-4 grid grid-cols-2 gap-2 opacity-90">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <Layers className="w-8 h-8 text-white/60" />
                </div>
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <Brush className="w-8 h-8 text-white/60" />
                </div>
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <PenTool className="w-8 h-8 text-white/60" />
                </div>
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <Palette className="w-8 h-8 text-white/60" />
                </div>
              </div>
            )}

            {/* 컬러 팔레트 */}
            {config.showColorPalette && (
              <div className="absolute bottom-4 right-4 flex gap-2">
                <div className="w-12 h-12 bg-purple-500 rounded-full shadow-lg" />
                <div className="w-12 h-12 bg-pink-500 rounded-full shadow-lg" />
                <div className="w-12 h-12 bg-blue-500 rounded-full shadow-lg" />
                <div className="w-12 h-12 bg-yellow-500 rounded-full shadow-lg" />
              </div>
            )}

            {/* 메인 컨텐츠 */}
            <div className="absolute inset-0 flex items-center">
              <div className="w-full max-w-2xl px-12 space-y-6">
                {/* 메인 타이틀 */}
                <h1 className={`${config.fontSize} font-black ${config.textColor} leading-tight whitespace-pre-line`}
                    style={{
                      fontFamily: 'Pretendard, sans-serif',
                      textShadow: config.textColor === 'text-white' ? '2px 2px 8px rgba(0,0,0,0.3)' : 'none'
                    }}>
                  {config.mainTitle}
                </h1>
                
                {/* 서브타이틀 */}
                <p className={`text-2xl ${config.textColor} font-medium opacity-90`}>
                  {config.subtitle}
                </p>

                {/* 통계 */}
                {config.showStats && (
                  <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                      <Award className={`w-6 h-6 ${config.textColor}`} />
                      <span className={`font-bold text-xl ${config.textColor}`}>
                        {config.portfolioCount}+ 프로젝트
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className={`w-6 h-6 ${config.textColor}`} />
                      <span className={`font-bold text-xl ${config.textColor}`}>
                        {config.clientText}
                      </span>
                    </div>
                  </div>
                )}

                {/* 프로세스 */}
                {config.showProcess && (
                  <div className="flex items-center gap-2">
                    {config.processSteps.map((step, index) => (
                      <div key={index} className="flex items-center">
                        <div className={`px-4 py-2 ${config.accentColor} text-white rounded-lg font-bold`}>
                          {step}
                        </div>
                        {index < config.processSteps.length - 1 && (
                          <ArrowRight className={`w-6 h-6 mx-2 ${config.textColor}`} />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* 툴 아이콘 */}
                {config.showTools && (
                  <div className="flex gap-3 mt-6">
                    <div className={`w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center`}>
                      <span className="text-2xl">🎨</span>
                    </div>
                    <div className={`w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center`}>
                      <span className="text-2xl">✨</span>
                    </div>
                    <div className={`w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center`}>
                      <span className="text-2xl">💡</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 장식 요소 */}
            <Sparkles className="absolute top-1/2 right-1/4 w-12 h-12 text-yellow-400 opacity-60 animate-pulse" />
            <Sparkles className="absolute bottom-1/3 left-1/3 w-8 h-8 text-purple-400 opacity-60 animate-pulse" />
          </Card>
          
          {/* 다운로드 버튼 */}
          <div className="flex justify-center">
            <Button
              onClick={handleDownload}
              disabled={isDownloading}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              <Download className="w-4 h-4 mr-2" />
              {isDownloading ? '이미지 생성 중...' : '디자인 썸네일 다운로드'}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Control Panel */}
      {showControls && (
        <Card className="w-80 h-full bg-white/95 backdrop-blur-sm border-l shadow-xl overflow-y-auto">
          <div className="p-4 border-b">
            <h2 className="text-lg font-bold">디자인 서비스 설정</h2>
          </div>

          <div className="p-4 space-y-4">
            {/* 텍스트 설정 */}
            <div className="space-y-3">
              <h3 className="font-medium text-sm">텍스트 편집</h3>
              
              <div>
                <label className="text-sm text-gray-600 mb-1 block">메인 타이틀 (줄바꿈 가능)</label>
                <textarea
                  value={config.mainTitle}
                  onChange={(e) => updateConfig('mainTitle', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm h-20"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">서브타이틀</label>
                <input
                  type="text"
                  value={config.subtitle}
                  onChange={(e) => updateConfig('subtitle', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">클라이언트 텍스트</label>
                <input
                  type="text"
                  value={config.clientText}
                  onChange={(e) => updateConfig('clientText', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">포트폴리오 수</label>
                <input
                  type="text"
                  value={config.portfolioCount}
                  onChange={(e) => updateConfig('portfolioCount', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">프로세스 단계 (쉼표로 구분)</label>
                <input
                  type="text"
                  value={config.processSteps.join(', ')}
                  onChange={(e) => updateConfig('processSteps', e.target.value.split(',').map(s => s.trim()))}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                  placeholder="기획, 디자인, 피드백, 완성"
                />
              </div>
            </div>

            {/* 표시 요소 */}
            <div className="space-y-3">
              <h3 className="font-medium text-sm">표시 요소</h3>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.showPortfolio}
                  onChange={(e) => updateConfig('showPortfolio', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">포트폴리오 그리드</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.showColorPalette}
                  onChange={(e) => updateConfig('showColorPalette', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">컬러 팔레트</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.showProcess}
                  onChange={(e) => updateConfig('showProcess', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">작업 프로세스</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.showStats}
                  onChange={(e) => updateConfig('showStats', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">통계 정보</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.showTools}
                  onChange={(e) => updateConfig('showTools', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">디자인 툴 아이콘</span>
              </label>
            </div>

            {/* 폰트 설정 */}
            <div className="space-y-3">
              <h3 className="font-medium text-sm">폰트 설정</h3>
              
              <div>
                <label className="text-sm text-gray-600 mb-1 block">텍스트 크기</label>
                <select
                  value={config.fontSize}
                  onChange={(e) => updateConfig('fontSize', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                >
                  <option value="text-4xl">보통</option>
                  <option value="text-5xl">크게</option>
                  <option value="text-6xl">매우 크게</option>
                </select>
              </div>
            </div>

            {/* 리셋 버튼 */}
            <Button 
              onClick={() => setConfig(defaultConfig)}
              variant="outline"
              className="w-full"
            >
              기본값으로 리셋
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
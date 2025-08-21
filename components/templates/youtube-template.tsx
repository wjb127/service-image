"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Settings, ArrowRight, TrendingUp, Play, Clock, Eye } from "lucide-react"
import { toPng } from "html-to-image"
import { useRef, useState, useEffect } from "react"

interface YoutubeConfig {
  mainText: string
  subText: string
  emoji: string
  badge: string
  showEmoji: boolean
  showBadge: boolean
  showArrow: boolean
  showDuration: boolean
  duration: string
  views: string
  textColor: string
  bgColor: string
  accentColor: string
  fontSize: string
  fontWeight: string
  fontFamily: string
}

const defaultConfig: YoutubeConfig = {
  mainText: "이것만 알면 끝!",
  subText: "10분 완벽 정리",
  emoji: "🔥",
  badge: "NEW",
  showEmoji: true,
  showBadge: true,
  showArrow: true,
  showDuration: false,
  duration: "10:23",
  views: "조회수 1.2만회",
  textColor: "text-white",
  bgColor: "bg-gradient-to-br from-red-600 to-purple-600",
  accentColor: "bg-yellow-400",
  fontSize: "text-6xl",
  fontWeight: "font-black",
  fontFamily: "pretendard"
}

export default function YoutubeTemplate() {
  const cardRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [config, setConfig] = useState<YoutubeConfig>(defaultConfig)
  const [customBgImage, setCustomBgImage] = useState<string | null>(null)
  const [showControls, setShowControls] = useState(false)

  // 폰트 로드
  useEffect(() => {
    const loadFonts = () => {
      const link = document.createElement('link')
      link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700;900&display=swap'
      link.rel = 'stylesheet'
      document.head.appendChild(link)
    }
    loadFonts()
  }, [])

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
        backgroundColor: '#000000',
        skipFonts: true,
        filter: (node) => {
          if (node.tagName === 'LINK' && node.getAttribute('rel') === 'stylesheet') {
            return false
          }
          return true
        }
      })
      
      const link = document.createElement('a')
      link.download = `youtube-thumbnail-${Date.now()}.png`
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error('Failed to generate image:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  const updateConfig = (key: keyof YoutubeConfig, value: any) => {
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
                onClick={() => setConfig({...config, bgColor: 'bg-gradient-to-br from-red-600 to-purple-600'})}
                variant="outline"
                className="px-3 py-2 text-sm"
              >
                빨강 배경
              </Button>
              <Button
                onClick={() => setConfig({...config, bgColor: 'bg-gradient-to-br from-blue-600 to-cyan-400'})}
                variant="outline"
                className="px-3 py-2 text-sm"
              >
                파랑 배경
              </Button>
              <Button
                onClick={() => setConfig({...config, bgColor: 'bg-gradient-to-br from-green-500 to-yellow-400'})}
                variant="outline"
                className="px-3 py-2 text-sm"
              >
                초록 배경
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

          {/* 유튜브 썸네일 카드 (16:9) */}
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
              <div className="absolute inset-0 bg-black/30" />
            )}

            {/* 뱃지 */}
            {config.showBadge && (
              <div className="absolute top-4 left-4 z-20">
                <div className={`${config.accentColor} text-black px-4 py-2 rounded-lg font-black text-xl shadow-lg animate-pulse`}>
                  {config.badge}
                </div>
              </div>
            )}

            {/* 영상 길이 */}
            {config.showDuration && (
              <div className="absolute bottom-4 right-4 z-20">
                <div className="bg-black/80 text-white px-3 py-1 rounded-md flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">{config.duration}</span>
                </div>
              </div>
            )}

            {/* 메인 컨텐츠 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative z-10 text-center px-8 max-w-3xl">
                {/* 이모지 */}
                {config.showEmoji && (
                  <div className="text-8xl mb-4 animate-bounce">
                    {config.emoji}
                  </div>
                )}
                
                {/* 메인 텍스트 */}
                <h1 className={`${config.fontSize} ${config.fontWeight} ${config.textColor} mb-4 leading-tight`}
                    style={{
                      fontFamily: config.fontFamily === 'pretendard' ? 'Pretendard, sans-serif' : 'Noto Sans KR, sans-serif',
                      textShadow: '4px 4px 8px rgba(0,0,0,0.5)'
                    }}>
                  {config.mainText}
                </h1>
                
                {/* 서브 텍스트 */}
                {config.subText && (
                  <p className={`text-3xl ${config.textColor} font-bold`}
                     style={{
                       textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                     }}>
                    {config.subText}
                  </p>
                )}

                {/* 화살표 */}
                {config.showArrow && (
                  <div className="absolute -right-16 top-1/2 -translate-y-1/2">
                    <ArrowRight className="w-20 h-20 text-yellow-400 animate-pulse" 
                                style={{
                                  filter: 'drop-shadow(4px 4px 8px rgba(0,0,0,0.5))'
                                }} />
                  </div>
                )}
              </div>
            </div>

            {/* 유튜브 플레이 버튼 오버레이 */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
              <Play className="w-32 h-32 text-white fill-white" />
            </div>
          </Card>
          
          {/* 다운로드 버튼 */}
          <div className="flex justify-center">
            <Button
              onClick={handleDownload}
              disabled={isDownloading}
              className="bg-gradient-to-r from-red-500 to-purple-500 hover:from-red-600 hover:to-purple-600 text-white font-medium px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              <Download className="w-4 h-4 mr-2" />
              {isDownloading ? '이미지 생성 중...' : '썸네일 다운로드'}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Control Panel */}
      {showControls && (
        <Card className="w-80 h-full bg-white/95 backdrop-blur-sm border-l shadow-xl overflow-y-auto">
          <div className="p-4 border-b">
            <h2 className="text-lg font-bold">유튜브 썸네일 설정</h2>
          </div>

          <div className="p-4 space-y-4">
            {/* 텍스트 설정 */}
            <div className="space-y-3">
              <h3 className="font-medium text-sm">텍스트 편집</h3>
              
              <div>
                <label className="text-sm text-gray-600 mb-1 block">메인 텍스트</label>
                <input
                  type="text"
                  value={config.mainText}
                  onChange={(e) => updateConfig('mainText', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">서브 텍스트</label>
                <input
                  type="text"
                  value={config.subText}
                  onChange={(e) => updateConfig('subText', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">이모지</label>
                <input
                  type="text"
                  value={config.emoji}
                  onChange={(e) => updateConfig('emoji', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                  placeholder="🔥 😱 🤯 💯"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">뱃지 텍스트</label>
                <input
                  type="text"
                  value={config.badge}
                  onChange={(e) => updateConfig('badge', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                  placeholder="NEW, HOT, 긴급"
                />
              </div>
            </div>

            {/* 표시 요소 */}
            <div className="space-y-3">
              <h3 className="font-medium text-sm">표시 요소</h3>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.showEmoji}
                  onChange={(e) => updateConfig('showEmoji', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">이모지 표시</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.showBadge}
                  onChange={(e) => updateConfig('showBadge', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">뱃지 표시</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.showArrow}
                  onChange={(e) => updateConfig('showArrow', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">화살표 표시</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.showDuration}
                  onChange={(e) => updateConfig('showDuration', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">영상 길이 표시</span>
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
                  <option value="text-5xl">보통</option>
                  <option value="text-6xl">크게</option>
                  <option value="text-7xl">매우 크게</option>
                  <option value="text-8xl">초대형</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">폰트 굵기</label>
                <select
                  value={config.fontWeight}
                  onChange={(e) => updateConfig('fontWeight', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                >
                  <option value="font-bold">굵게</option>
                  <option value="font-extrabold">매우 굵게</option>
                  <option value="font-black">블랙</option>
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
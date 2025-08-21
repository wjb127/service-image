"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Settings, ChevronRight, Heart, Bookmark, MessageCircle, Send } from "lucide-react"
import { toPng } from "html-to-image"
import { useRef, useState, useEffect } from "react"

interface InstagramConfig {
  mainTitle: string
  contentText: string
  pageNumber: string
  totalPages: string
  hashtags: string
  ctaText: string
  showPageNumber: boolean
  showSwipeHint: boolean
  showHashtags: boolean
  showCTA: boolean
  showInstagramUI: boolean
  bgColor: string
  textColor: string
  accentColor: string
  fontSize: string
  fontFamily: string
}

const defaultConfig: InstagramConfig = {
  mainTitle: "5가지 꿀팁",
  contentText: "당신이 몰랐던\n시간 관리의 비밀",
  pageNumber: "1",
  totalPages: "5",
  hashtags: "#자기계발 #생산성 #시간관리 #꿀팁",
  ctaText: "더 보려면 스와이프 →",
  showPageNumber: true,
  showSwipeHint: true,
  showHashtags: true,
  showCTA: true,
  showInstagramUI: false,
  bgColor: "bg-gradient-to-br from-pink-400 to-purple-600",
  textColor: "text-white",
  accentColor: "bg-yellow-300",
  fontSize: "text-5xl",
  fontFamily: "pretendard"
}

export default function InstagramTemplate() {
  const cardRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [config, setConfig] = useState<InstagramConfig>(defaultConfig)
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
      link.download = `instagram-card-${config.pageNumber}-${Date.now()}.png`
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error('Failed to generate image:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  const updateConfig = (key: keyof InstagramConfig, value: any) => {
    setConfig({ ...config, [key]: value })
  }

  return (
    <div className="flex h-[calc(100vh-12rem)]">
      {/* Main content area */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
        <div className="w-full max-w-2xl space-y-4">
          {/* 간단한 컨트롤 버튼들 */}
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button
                onClick={() => setConfig({...config, bgColor: 'bg-gradient-to-br from-pink-400 to-purple-600'})}
                variant="outline"
                className="px-3 py-2 text-sm"
              >
                핑크 그라데이션
              </Button>
              <Button
                onClick={() => setConfig({...config, bgColor: 'bg-gradient-to-br from-blue-400 to-cyan-500'})}
                variant="outline"
                className="px-3 py-2 text-sm"
              >
                블루 그라데이션
              </Button>
              <Button
                onClick={() => setConfig({...config, bgColor: 'bg-white', textColor: 'text-gray-900'})}
                variant="outline"
                className="px-3 py-2 text-sm"
              >
                미니멀 화이트
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

          {/* 인스타그램 카드 (1:1) */}
          <Card 
            ref={cardRef} 
            className={`relative w-full aspect-square ${customBgImage ? '' : config.bgColor} overflow-hidden`}
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

            {/* 인스타그램 UI */}
            {config.showInstagramUI && (
              <>
                <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20">
                  <div className="text-white font-bold text-lg">@yourusername</div>
                  <div className="flex gap-3">
                    <Heart className="w-6 h-6 text-white" />
                    <MessageCircle className="w-6 h-6 text-white" />
                    <Send className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-center z-20">
                  <Bookmark className="w-6 h-6 text-white" />
                </div>
              </>
            )}

            {/* 페이지 번호 */}
            {config.showPageNumber && (
              <div className="absolute top-6 right-6 z-20">
                <div className={`${config.textColor === 'text-white' ? 'bg-black/30' : 'bg-white/80'} px-4 py-2 rounded-full`}>
                  <span className={`${config.textColor} font-bold text-lg`}>
                    {config.pageNumber}/{config.totalPages}
                  </span>
                </div>
              </div>
            )}

            {/* 메인 컨텐츠 */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
              <div className="text-center space-y-6 max-w-md">
                {/* 메인 타이틀 */}
                <h1 className={`${config.fontSize} font-black ${config.textColor} leading-tight mb-6`}
                    style={{
                      fontFamily: 'Pretendard, sans-serif',
                      textShadow: config.textColor === 'text-white' ? '2px 2px 8px rgba(0,0,0,0.3)' : 'none'
                    }}>
                  {config.mainTitle}
                </h1>
                
                {/* 컨텐츠 텍스트 */}
                <p className={`text-2xl ${config.textColor} font-medium whitespace-pre-line`}
                   style={{
                     textShadow: config.textColor === 'text-white' ? '1px 1px 4px rgba(0,0,0,0.3)' : 'none'
                   }}>
                  {config.contentText}
                </p>

                {/* CTA */}
                {config.showCTA && config.ctaText && (
                  <div className="mt-8">
                    <div className={`${config.accentColor} text-black px-6 py-3 rounded-full inline-block font-bold shadow-lg`}>
                      {config.ctaText}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 스와이프 힌트 */}
            {config.showSwipeHint && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
                <div className="flex items-center gap-2 animate-bounce">
                  <div className={`w-2 h-2 rounded-full ${config.textColor === 'text-white' ? 'bg-white/60' : 'bg-gray-400'}`} />
                  <div className={`w-2 h-2 rounded-full ${config.textColor === 'text-white' ? 'bg-white' : 'bg-gray-600'}`} />
                  <div className={`w-2 h-2 rounded-full ${config.textColor === 'text-white' ? 'bg-white/60' : 'bg-gray-400'}`} />
                  <ChevronRight className={`w-5 h-5 ${config.textColor}`} />
                </div>
              </div>
            )}

            {/* 해시태그 */}
            {config.showHashtags && config.hashtags && (
              <div className="absolute bottom-20 left-0 right-0 px-12 z-10">
                <p className={`text-sm ${config.textColor} opacity-80 text-center`}>
                  {config.hashtags}
                </p>
              </div>
            )}
          </Card>
          
          {/* 다운로드 버튼 */}
          <div className="flex justify-center">
            <Button
              onClick={handleDownload}
              disabled={isDownloading}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-medium px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              <Download className="w-4 h-4 mr-2" />
              {isDownloading ? '이미지 생성 중...' : '카드뉴스 다운로드'}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Control Panel */}
      {showControls && (
        <Card className="w-80 h-full bg-white/95 backdrop-blur-sm border-l shadow-xl overflow-y-auto">
          <div className="p-4 border-b">
            <h2 className="text-lg font-bold">인스타그램 카드 설정</h2>
          </div>

          <div className="p-4 space-y-4">
            {/* 텍스트 설정 */}
            <div className="space-y-3">
              <h3 className="font-medium text-sm">텍스트 편집</h3>
              
              <div>
                <label className="text-sm text-gray-600 mb-1 block">메인 타이틀</label>
                <input
                  type="text"
                  value={config.mainTitle}
                  onChange={(e) => updateConfig('mainTitle', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">내용 (줄바꿈 가능)</label>
                <textarea
                  value={config.contentText}
                  onChange={(e) => updateConfig('contentText', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm h-24"
                />
              </div>

              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-sm text-gray-600 mb-1 block">현재 페이지</label>
                  <input
                    type="text"
                    value={config.pageNumber}
                    onChange={(e) => updateConfig('pageNumber', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm text-gray-600 mb-1 block">전체 페이지</label>
                  <input
                    type="text"
                    value={config.totalPages}
                    onChange={(e) => updateConfig('totalPages', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">해시태그</label>
                <input
                  type="text"
                  value={config.hashtags}
                  onChange={(e) => updateConfig('hashtags', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                  placeholder="#해시태그 #인스타그램"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">CTA 텍스트</label>
                <input
                  type="text"
                  value={config.ctaText}
                  onChange={(e) => updateConfig('ctaText', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                  placeholder="더 보려면 스와이프 →"
                />
              </div>
            </div>

            {/* 표시 요소 */}
            <div className="space-y-3">
              <h3 className="font-medium text-sm">표시 요소</h3>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.showPageNumber}
                  onChange={(e) => updateConfig('showPageNumber', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">페이지 번호</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.showSwipeHint}
                  onChange={(e) => updateConfig('showSwipeHint', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">스와이프 힌트</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.showHashtags}
                  onChange={(e) => updateConfig('showHashtags', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">해시태그</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.showCTA}
                  onChange={(e) => updateConfig('showCTA', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">CTA 버튼</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.showInstagramUI}
                  onChange={(e) => updateConfig('showInstagramUI', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">인스타그램 UI</span>
              </label>
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
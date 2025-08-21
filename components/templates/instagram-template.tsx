"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Settings, ChevronRight, ChevronDown, ChevronUp, Type, Palette, Layout, Sparkles, Image } from "lucide-react"
import { toPng } from "html-to-image"
import { useRef, useState } from "react"

interface InstagramConfig {
  // 텍스트 콘텐츠
  mainTitle: string
  contentText: string
  hashtags: string
  ctaText: string
  
  // 배경 설정
  bgType: 'solid' | 'gradient' | 'image'
  bgColor: string
  bgGradientStart: string
  bgGradientEnd: string
  bgGradientDirection: string
  bgOverlayOpacity: number
  bgBlur: number
  
  // 텍스트 스타일
  mainTitleSize: string
  mainTitleWeight: string
  mainTitleColor: string
  contentSize: string
  contentColor: string
  fontFamily: string
  textAlign: 'left' | 'center' | 'right'
  textPosition: 'top' | 'center' | 'bottom'
  textShadow: boolean
  
  // 표시 요소
  showSwipeHint: boolean
  showHashtags: boolean
  showCTA: boolean
  showPageDots: boolean
  currentPage: number
  totalPages: number
  
  // 레이아웃 템플릿
  layoutTemplate: 'default' | 'list' | 'quote' | 'stats' | 'qna'
  
  // 추가 요소
  accentShape: 'none' | 'circle' | 'square' | 'bubble'
  accentColor: string
  emoji: string
  showEmoji: boolean
}

const defaultConfig: InstagramConfig = {
  mainTitle: "5가지 꿀팁",
  contentText: "당신이 몰랐던\n시간 관리의 비밀",
  hashtags: "#자기계발 #생산성 #시간관리 #꿀팁",
  ctaText: "더 보려면 스와이프 →",
  
  bgType: 'gradient',
  bgColor: '#ffffff',
  bgGradientStart: '#ec4899',
  bgGradientEnd: '#9333ea',
  bgGradientDirection: 'to-br',
  bgOverlayOpacity: 20,
  bgBlur: 0,
  
  mainTitleSize: 'text-5xl',
  mainTitleWeight: 'font-black',
  mainTitleColor: '#ffffff',
  contentSize: 'text-2xl',
  contentColor: '#ffffff',
  fontFamily: 'pretendard',
  textAlign: 'center',
  textPosition: 'center',
  textShadow: true,
  
  showSwipeHint: true,
  showHashtags: true,
  showCTA: true,
  showPageDots: true,
  currentPage: 1,
  totalPages: 5,
  
  layoutTemplate: 'default',
  
  accentShape: 'none',
  accentColor: '#fbbf24',
  emoji: '💡',
  showEmoji: false
}

// 프리셋 배경 색상
const presetColors = [
  { name: '화이트', value: '#ffffff' },
  { name: '블랙', value: '#000000' },
  { name: '베이지', value: '#f5f5dc' },
  { name: '핑크', value: '#ffc0cb' },
  { name: '스카이', value: '#87ceeb' },
  { name: '민트', value: '#b2f2bb' }
]

// 인기 그라데이션 조합
const presetGradients = [
  { name: '선셋', start: '#ff6b6b', end: '#feca57' },
  { name: '오션', start: '#667eea', end: '#764ba2' },
  { name: '로즈', start: '#f093fb', end: '#f5576c' },
  { name: '민트', start: '#4facfe', end: '#00f2fe' },
  { name: '피치', start: '#fa709a', end: '#fee140' },
  { name: '라벤더', start: '#a8edea', end: '#fed6e3' }
]

export default function InstagramTemplate() {
  const cardRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [config, setConfig] = useState<InstagramConfig>(defaultConfig)
  const [customBgImage, setCustomBgImage] = useState<string | null>(null)
  const [showControls, setShowControls] = useState(false)
  
  // 아코디언 섹션 상태
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['background']))

  const handleImageUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setCustomBgImage(result)
        setConfig({ ...config, bgType: 'image' })
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
      link.download = `instagram-card-${config.currentPage}-${Date.now()}.png`
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

  const toggleSection = (section: string) => {
    const newSections = new Set(openSections)
    if (newSections.has(section)) {
      newSections.delete(section)
    } else {
      newSections.add(section)
    }
    setOpenSections(newSections)
  }

  // 배경 스타일 계산
  const getBackgroundStyle = () => {
    if (config.bgType === 'solid') {
      return { backgroundColor: config.bgColor }
    } else if (config.bgType === 'gradient') {
      const direction = {
        'to-br': 'to bottom right',
        'to-r': 'to right',
        'to-b': 'to bottom',
        'to-tr': 'to top right'
      }[config.bgGradientDirection] || 'to bottom right'
      
      return {
        background: `linear-gradient(${direction}, ${config.bgGradientStart}, ${config.bgGradientEnd})`
      }
    } else if (config.bgType === 'image' && customBgImage) {
      return {
        backgroundImage: `url(${customBgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }
    }
    return {}
  }

  // 텍스트 위치 클래스 계산
  const getTextPositionClass = () => {
    const positions = {
      top: 'justify-start pt-16',
      center: 'justify-center',
      bottom: 'justify-end pb-16'
    }
    return positions[config.textPosition] || 'justify-center'
  }

  return (
    <div className="flex min-h-[600px]">
      {/* Main content area */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-visible">
        <div className="w-full max-w-2xl space-y-4">
          {/* 간단한 컨트롤 버튼들 */}
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {presetGradients.slice(0, 3).map((gradient) => (
                <Button
                  key={gradient.name}
                  onClick={() => setConfig({
                    ...config,
                    bgType: 'gradient',
                    bgGradientStart: gradient.start,
                    bgGradientEnd: gradient.end
                  })}
                  variant="outline"
                  className="px-3 py-2 text-sm"
                >
                  {gradient.name}
                </Button>
              ))}
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
            className="relative w-full aspect-square overflow-hidden"
            style={getBackgroundStyle()}
          >
            {/* 배경 이미지 오버레이 */}
            {config.bgType === 'image' && customBgImage && config.bgOverlayOpacity > 0 && (
              <div 
                className="absolute inset-0" 
                style={{
                  backgroundColor: `rgba(0, 0, 0, ${config.bgOverlayOpacity / 100})`,
                  backdropFilter: config.bgBlur > 0 ? `blur(${config.bgBlur}px)` : 'none'
                }}
              />
            )}

            {/* 메인 컨텐츠 */}
            <div className={`absolute inset-0 flex flex-col ${getTextPositionClass()} p-12`}>
              <div className={`space-y-6 max-w-md ${config.textAlign === 'left' ? 'w-full' : config.textAlign === 'right' ? 'w-full ml-auto' : 'mx-auto'}`}>
                {/* 이모지 */}
                {config.showEmoji && config.emoji && (
                  <div className={`text-7xl ${config.textAlign === 'left' ? 'text-left' : config.textAlign === 'right' ? 'text-right' : 'text-center'}`}>
                    {config.emoji}
                  </div>
                )}

                {/* 레이아웃별 렌더링 */}
                {config.layoutTemplate === 'default' && (
                  <>
                    {/* 메인 타이틀 */}
                    <h1 className={`${config.mainTitleSize} ${config.mainTitleWeight} leading-tight mb-6`}
                        style={{
                          color: config.mainTitleColor,
                          fontFamily: 'Pretendard, sans-serif',
                          textShadow: config.textShadow ? '2px 2px 8px rgba(0,0,0,0.3)' : 'none',
                          textAlign: config.textAlign
                        }}>
                      {config.mainTitle}
                    </h1>
                    
                    {/* 컨텐츠 텍스트 */}
                    <p className={`${config.contentSize} font-medium whitespace-pre-line`}
                       style={{
                         color: config.contentColor,
                         textShadow: config.textShadow ? '1px 1px 4px rgba(0,0,0,0.3)' : 'none',
                         textAlign: config.textAlign
                       }}>
                      {config.contentText}
                    </p>
                  </>
                )}

                {config.layoutTemplate === 'list' && (
                  <div className="space-y-4">
                    <h1 className={`${config.mainTitleSize} ${config.mainTitleWeight} mb-8`}
                        style={{
                          color: config.mainTitleColor,
                          textShadow: config.textShadow ? '2px 2px 8px rgba(0,0,0,0.3)' : 'none',
                          textAlign: config.textAlign
                        }}>
                      {config.mainTitle}
                    </h1>
                    {config.contentText.split('\n').map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold"
                             style={{ backgroundColor: config.accentColor, color: '#000' }}>
                          {index + 1}
                        </div>
                        <p className="flex-1 text-xl" style={{ color: config.contentColor }}>
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {config.layoutTemplate === 'quote' && (
                  <div className="relative">
                    <div className="text-8xl opacity-20 absolute -top-8 -left-4"
                         style={{ color: config.accentColor }}>
                      "
                    </div>
                    <p className={`${config.contentSize} font-medium italic relative z-10`}
                       style={{
                         color: config.contentColor,
                         textShadow: config.textShadow ? '1px 1px 4px rgba(0,0,0,0.3)' : 'none',
                         textAlign: config.textAlign
                       }}>
                      {config.contentText}
                    </p>
                    <p className="text-lg mt-4 opacity-80"
                       style={{
                         color: config.mainTitleColor,
                         textAlign: config.textAlign
                       }}>
                      — {config.mainTitle}
                    </p>
                  </div>
                )}

                {/* CTA */}
                {config.showCTA && config.ctaText && (
                  <div className={`mt-8 ${config.textAlign === 'left' ? 'text-left' : config.textAlign === 'right' ? 'text-right' : 'text-center'}`}>
                    <div className="px-6 py-3 rounded-full inline-block font-bold shadow-lg"
                         style={{ backgroundColor: config.accentColor, color: '#000' }}>
                      {config.ctaText}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 페이지 도트 인디케이터 */}
            {config.showPageDots && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
                <div className="flex items-center gap-2">
                  {[...Array(config.totalPages)].map((_, i) => (
                    <div 
                      key={i}
                      className={`w-2 h-2 rounded-full transition-all ${
                        i === config.currentPage - 1 
                          ? 'w-6' 
                          : ''
                      }`}
                      style={{
                        backgroundColor: i === config.currentPage - 1 
                          ? config.mainTitleColor 
                          : `${config.mainTitleColor}60`
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 스와이프 힌트 */}
            {config.showSwipeHint && (
              <div className="absolute bottom-8 right-8 z-20">
                <ChevronRight className="w-6 h-6 animate-pulse" style={{ color: config.mainTitleColor }} />
              </div>
            )}

            {/* 해시태그 */}
            {config.showHashtags && config.hashtags && (
              <div className="absolute bottom-20 left-0 right-0 px-12 z-10">
                <p className="text-sm opacity-80"
                   style={{
                     color: config.contentColor,
                     textAlign: config.textAlign
                   }}>
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
        <Card className="w-96 h-full bg-white/95 backdrop-blur-sm border-l shadow-xl overflow-y-auto">
          <div className="p-4 border-b">
            <h2 className="text-lg font-bold">인스타그램 카드 설정</h2>
          </div>

          <div className="p-4 space-y-2">
            {/* 배경 설정 섹션 */}
            <div className="border rounded-lg">
              <button
                onClick={() => toggleSection('background')}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  <span className="font-medium">배경 설정</span>
                </div>
                {openSections.has('background') ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              {openSections.has('background') && (
                <div className="p-4 space-y-3 border-t">
                  <div>
                    <label className="text-sm text-gray-600 mb-2 block">배경 타입</label>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => updateConfig('bgType', 'solid')}
                        variant={config.bgType === 'solid' ? 'default' : 'outline'}
                        className="flex-1 text-xs"
                      >
                        단색
                      </Button>
                      <Button
                        onClick={() => updateConfig('bgType', 'gradient')}
                        variant={config.bgType === 'gradient' ? 'default' : 'outline'}
                        className="flex-1 text-xs"
                      >
                        그라데이션
                      </Button>
                      <Button
                        onClick={() => updateConfig('bgType', 'image')}
                        variant={config.bgType === 'image' ? 'default' : 'outline'}
                        className="flex-1 text-xs"
                      >
                        이미지
                      </Button>
                    </div>
                  </div>

                  {config.bgType === 'solid' && (
                    <div>
                      <label className="text-sm text-gray-600 mb-2 block">색상 선택</label>
                      <div className="grid grid-cols-3 gap-2">
                        {presetColors.map((color) => (
                          <button
                            key={color.name}
                            onClick={() => updateConfig('bgColor', color.value)}
                            className="p-2 border rounded text-xs"
                            style={{ backgroundColor: color.value }}
                          >
                            {color.name}
                          </button>
                        ))}
                      </div>
                      <input
                        type="color"
                        value={config.bgColor}
                        onChange={(e) => updateConfig('bgColor', e.target.value)}
                        className="w-full mt-2 h-10"
                      />
                    </div>
                  )}

                  {config.bgType === 'gradient' && (
                    <>
                      <div>
                        <label className="text-sm text-gray-600 mb-2 block">인기 조합</label>
                        <div className="grid grid-cols-2 gap-2">
                          {presetGradients.map((gradient) => (
                            <button
                              key={gradient.name}
                              onClick={() => {
                                updateConfig('bgGradientStart', gradient.start)
                                updateConfig('bgGradientEnd', gradient.end)
                              }}
                              className="p-2 border rounded text-xs"
                              style={{
                                background: `linear-gradient(to right, ${gradient.start}, ${gradient.end})`
                              }}
                            >
                              {gradient.name}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="text-xs text-gray-600">시작 색상</label>
                          <input
                            type="color"
                            value={config.bgGradientStart}
                            onChange={(e) => updateConfig('bgGradientStart', e.target.value)}
                            className="w-full h-8"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="text-xs text-gray-600">끝 색상</label>
                          <input
                            type="color"
                            value={config.bgGradientEnd}
                            onChange={(e) => updateConfig('bgGradientEnd', e.target.value)}
                            className="w-full h-8"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600 mb-1 block">방향</label>
                        <select
                          value={config.bgGradientDirection}
                          onChange={(e) => updateConfig('bgGradientDirection', e.target.value)}
                          className="w-full px-3 py-2 border rounded-md text-sm"
                        >
                          <option value="to-br">↘ 대각선 (우하)</option>
                          <option value="to-r">→ 가로</option>
                          <option value="to-b">↓ 세로</option>
                          <option value="to-tr">↗ 대각선 (우상)</option>
                        </select>
                      </div>
                    </>
                  )}

                  {config.bgType === 'image' && (
                    <>
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        variant="outline"
                        className="w-full"
                      >
                        <Image className="w-4 h-4 mr-2" />
                        이미지 업로드
                      </Button>
                      <div>
                        <label className="text-sm text-gray-600 mb-1 block">
                          오버레이 투명도: {config.bgOverlayOpacity}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={config.bgOverlayOpacity}
                          onChange={(e) => updateConfig('bgOverlayOpacity', parseInt(e.target.value))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-600 mb-1 block">
                          블러 효과: {config.bgBlur}px
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="20"
                          value={config.bgBlur}
                          onChange={(e) => updateConfig('bgBlur', parseInt(e.target.value))}
                          className="w-full"
                        />
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* 텍스트 콘텐츠 섹션 */}
            <div className="border rounded-lg">
              <button
                onClick={() => toggleSection('content')}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  <span className="font-medium">텍스트 콘텐츠</span>
                </div>
                {openSections.has('content') ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              {openSections.has('content') && (
                <div className="p-4 space-y-3 border-t">
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

                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">이모지</label>
                    <input
                      type="text"
                      value={config.emoji}
                      onChange={(e) => updateConfig('emoji', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md text-sm"
                      placeholder="💡 🔥 ✨"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 텍스트 스타일 섹션 */}
            <div className="border rounded-lg">
              <button
                onClick={() => toggleSection('style')}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  <span className="font-medium">텍스트 스타일</span>
                </div>
                {openSections.has('style') ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              {openSections.has('style') && (
                <div className="p-4 space-y-3 border-t">
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">메인 타이틀 크기</label>
                    <select
                      value={config.mainTitleSize}
                      onChange={(e) => updateConfig('mainTitleSize', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md text-sm"
                    >
                      <option value="text-3xl">작게</option>
                      <option value="text-4xl">보통</option>
                      <option value="text-5xl">크게</option>
                      <option value="text-6xl">매우 크게</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">메인 타이틀 굵기</label>
                    <select
                      value={config.mainTitleWeight}
                      onChange={(e) => updateConfig('mainTitleWeight', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md text-sm"
                    >
                      <option value="font-normal">보통</option>
                      <option value="font-bold">굵게</option>
                      <option value="font-extrabold">매우 굵게</option>
                      <option value="font-black">블랙</option>
                    </select>
                  </div>

                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="text-xs text-gray-600">타이틀 색상</label>
                      <input
                        type="color"
                        value={config.mainTitleColor}
                        onChange={(e) => updateConfig('mainTitleColor', e.target.value)}
                        className="w-full h-8"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-gray-600">내용 색상</label>
                      <input
                        type="color"
                        value={config.contentColor}
                        onChange={(e) => updateConfig('contentColor', e.target.value)}
                        className="w-full h-8"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-gray-600">액센트 색상</label>
                      <input
                        type="color"
                        value={config.accentColor}
                        onChange={(e) => updateConfig('accentColor', e.target.value)}
                        className="w-full h-8"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">텍스트 정렬</label>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => updateConfig('textAlign', 'left')}
                        variant={config.textAlign === 'left' ? 'default' : 'outline'}
                        className="flex-1 text-xs"
                      >
                        왼쪽
                      </Button>
                      <Button
                        onClick={() => updateConfig('textAlign', 'center')}
                        variant={config.textAlign === 'center' ? 'default' : 'outline'}
                        className="flex-1 text-xs"
                      >
                        중앙
                      </Button>
                      <Button
                        onClick={() => updateConfig('textAlign', 'right')}
                        variant={config.textAlign === 'right' ? 'default' : 'outline'}
                        className="flex-1 text-xs"
                      >
                        오른쪽
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">텍스트 위치</label>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => updateConfig('textPosition', 'top')}
                        variant={config.textPosition === 'top' ? 'default' : 'outline'}
                        className="flex-1 text-xs"
                      >
                        상단
                      </Button>
                      <Button
                        onClick={() => updateConfig('textPosition', 'center')}
                        variant={config.textPosition === 'center' ? 'default' : 'outline'}
                        className="flex-1 text-xs"
                      >
                        중앙
                      </Button>
                      <Button
                        onClick={() => updateConfig('textPosition', 'bottom')}
                        variant={config.textPosition === 'bottom' ? 'default' : 'outline'}
                        className="flex-1 text-xs"
                      >
                        하단
                      </Button>
                    </div>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.textShadow}
                      onChange={(e) => updateConfig('textShadow', e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">텍스트 그림자 효과</span>
                  </label>
                </div>
              )}
            </div>

            {/* 레이아웃 섹션 */}
            <div className="border rounded-lg">
              <button
                onClick={() => toggleSection('layout')}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  <Layout className="w-4 h-4" />
                  <span className="font-medium">레이아웃 템플릿</span>
                </div>
                {openSections.has('layout') ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              {openSections.has('layout') && (
                <div className="p-4 space-y-3 border-t">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => updateConfig('layoutTemplate', 'default')}
                      variant={config.layoutTemplate === 'default' ? 'default' : 'outline'}
                      className="text-xs"
                    >
                      기본
                    </Button>
                    <Button
                      onClick={() => updateConfig('layoutTemplate', 'list')}
                      variant={config.layoutTemplate === 'list' ? 'default' : 'outline'}
                      className="text-xs"
                    >
                      리스트형
                    </Button>
                    <Button
                      onClick={() => updateConfig('layoutTemplate', 'quote')}
                      variant={config.layoutTemplate === 'quote' ? 'default' : 'outline'}
                      className="text-xs"
                    >
                      인용구형
                    </Button>
                    <Button
                      onClick={() => updateConfig('layoutTemplate', 'stats')}
                      variant={config.layoutTemplate === 'stats' ? 'default' : 'outline'}
                      className="text-xs"
                      disabled
                    >
                      통계형
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* 추가 요소 섹션 */}
            <div className="border rounded-lg">
              <button
                onClick={() => toggleSection('elements')}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span className="font-medium">추가 요소</span>
                </div>
                {openSections.has('elements') ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              {openSections.has('elements') && (
                <div className="p-4 space-y-3 border-t">
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
                      checked={config.showPageDots}
                      onChange={(e) => updateConfig('showPageDots', e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">페이지 인디케이터</span>
                  </label>

                  {config.showPageDots && (
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="text-xs text-gray-600">현재 페이지</label>
                        <input
                          type="number"
                          min="1"
                          max={config.totalPages}
                          value={config.currentPage}
                          onChange={(e) => updateConfig('currentPage', parseInt(e.target.value))}
                          className="w-full px-2 py-1 border rounded text-sm"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs text-gray-600">전체 페이지</label>
                        <input
                          type="number"
                          min="1"
                          value={config.totalPages}
                          onChange={(e) => updateConfig('totalPages', parseInt(e.target.value))}
                          className="w-full px-2 py-1 border rounded text-sm"
                        />
                      </div>
                    </div>
                  )}

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
                </div>
              )}
            </div>

            {/* 리셋 버튼 */}
            <Button 
              onClick={() => setConfig(defaultConfig)}
              variant="outline"
              className="w-full mt-4"
            >
              기본값으로 리셋
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
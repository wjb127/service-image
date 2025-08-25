"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Download, Eye, Code,
  AlignLeft, AlignCenter, AlignRight,
  Upload, MoreVertical
} from "lucide-react"
import { 
  Toolbar, 
  ToolbarSection, 
  ToolbarButton, 
  ToolbarSelect,
  ToolbarColorPicker,
  ToolbarToggle,
  ToolbarSlider
} from "@/components/ui/toolbar"
import { toPng } from "html-to-image"
import { useRef, useState } from "react"
import AIAssistant from "@/components/ai-assistant"
import Watermark from "@/components/watermark"

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
  showHashtags: boolean
  showCTA: boolean
  showWatermark: boolean
  watermarkText: string
  
  // 레이아웃 템플릿
  layoutTemplate: 'default' | 'list' | 'quote' | 'stats' | 'qna'
  
  // 추가 요소
  accentShape: 'none' | 'circle' | 'square' | 'bubble'
  accentColor: string
  emoji: string
  showEmoji: boolean
  blur: number
  opacity: number
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
  
  showHashtags: true,
  showCTA: true,
  showWatermark: true,
  watermarkText: 'service-image.vercel.app',
  
  layoutTemplate: 'default',
  
  accentShape: 'none',
  accentColor: '#fbbf24',
  emoji: '💡',
  showEmoji: false,
  blur: 0,
  opacity: 100
}

// 프리셋 배경 색상
// const presetColors = [
//   { name: '화이트', value: '#ffffff' },
//   { name: '블랙', value: '#000000' },
//   { name: '베이지', value: '#f5f5dc' },
//   { name: '핑크', value: '#ffc0cb' },
//   { name: '스카이', value: '#87ceeb' },
//   { name: '민트', value: '#b2f2bb' }
// ]

// 인기 그라데이션 조합
// const presetGradients = [
//   { name: '선셋', start: '#ff6b6b', end: '#feca57' },
//   { name: '오션', start: '#667eea', end: '#764ba2' },
//   { name: '로즈', start: '#f093fb', end: '#f5576c' },
//   { name: '민트', start: '#4facfe', end: '#00f2fe' },
//   { name: '피치', start: '#fa709a', end: '#fee140' },
//   { name: '라벤더', start: '#a8edea', end: '#fed6e3' }
// ]

export default function InstagramTemplateV2() {
  const cardRef = useRef<HTMLDivElement>(null)
  // const codeRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [config, setConfig] = useState<InstagramConfig>(defaultConfig)
  const [customBgImage, setCustomBgImage] = useState<string | null>(null)
  const [showCode, setShowCode] = useState(false)
  const [showMoreOptions, setShowMoreOptions] = useState(false)
  const [isAIExpanded, setIsAIExpanded] = useState(false)

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
      link.download = `instagram-card-${Date.now()}.png`
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error('Failed to generate image:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  const updateConfig = (key: keyof InstagramConfig, value: string | boolean | number) => {
    setConfig({ ...config, [key]: value })
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

  // 코드 생성
  const generateCode = () => {
    return `<div style="${JSON.stringify(getBackgroundStyle(), null, 2)}">
  <h1 style="
    font-size: ${config.mainTitleSize};
    font-weight: ${config.mainTitleWeight};
    color: ${config.mainTitleColor};
    text-align: ${config.textAlign};
    ${config.textShadow ? 'text-shadow: 2px 2px 8px rgba(0,0,0,0.3);' : ''}
  ">
    ${config.mainTitle}
  </h1>
  <p style="
    font-size: ${config.contentSize};
    color: ${config.contentColor};
    text-align: ${config.textAlign};
  ">
    ${config.contentText}
  </p>
  ${config.showHashtags ? `<p>${config.hashtags}</p>` : ''}
  ${config.showCTA ? `<button>${config.ctaText}</button>` : ''}
</div>`
  }

  return (
    <div className="flex h-screen">
      {/* 메인 컨텐츠 영역 */}
      <div className={`flex flex-col flex-1 transition-all duration-300 ${isAIExpanded ? 'mr-96' : 'mr-0'}`}>
        {/* 상단 툴바 컨테이너 */}
        <div className="flex-none bg-white border-b-2 border-gray-200 shadow-md">
          {/* 첫 번째 줄 */}
          <Toolbar className="border-b-0">
        {/* 레이아웃 섹션 */}
        <ToolbarSection>
          <ToolbarSelect
            value={config.layoutTemplate}
            onChange={(value) => updateConfig('layoutTemplate', value as 'default' | 'list' | 'quote' | 'stats' | 'qna')}
            options={[
              { value: 'default', label: '기본' },
              { value: 'list', label: '리스트' },
              { value: 'quote', label: '인용구' }
            ]}
            label="레이아웃"
          />
        </ToolbarSection>

        {/* 배경 섹션 */}
        <ToolbarSection>
          <span className="text-sm text-gray-600">배경:</span>
          <ToolbarButton
            active={config.bgType === 'solid'}
            onClick={() => updateConfig('bgType', 'solid')}
          >
            단색
          </ToolbarButton>
          <ToolbarButton
            active={config.bgType === 'gradient'}
            onClick={() => updateConfig('bgType', 'gradient')}
          >
            그라데이션
          </ToolbarButton>
          <ToolbarButton
            active={config.bgType === 'image'}
            onClick={() => updateConfig('bgType', 'image')}
          >
            이미지
          </ToolbarButton>
          
          {config.bgType === 'solid' && (
            <ToolbarColorPicker
              value={config.bgColor}
              onChange={(value) => updateConfig('bgColor', value)}
            />
          )}
          
          {config.bgType === 'gradient' && (
            <>
              <ToolbarColorPicker
                value={config.bgGradientStart}
                onChange={(value) => updateConfig('bgGradientStart', value)}
              />
              <ToolbarColorPicker
                value={config.bgGradientEnd}
                onChange={(value) => updateConfig('bgGradientEnd', value)}
              />
            </>
          )}
          
          {config.bgType === 'image' && (
            <ToolbarButton onClick={() => fileInputRef.current?.click()}>
              <Upload className="w-4 h-4" />
              업로드
            </ToolbarButton>
          )}
        </ToolbarSection>

        {/* 텍스트 정렬 섹션 */}
        <ToolbarSection>
          <span className="text-sm text-gray-600">정렬:</span>
          <ToolbarButton
            active={config.textAlign === 'left'}
            onClick={() => updateConfig('textAlign', 'left')}
          >
            <AlignLeft className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            active={config.textAlign === 'center'}
            onClick={() => updateConfig('textAlign', 'center')}
          >
            <AlignCenter className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            active={config.textAlign === 'right'}
            onClick={() => updateConfig('textAlign', 'right')}
          >
            <AlignRight className="w-4 h-4" />
          </ToolbarButton>
        </ToolbarSection>

        {/* 텍스트 스타일 섹션 */}
        <ToolbarSection>
          <ToolbarColorPicker
            value={config.mainTitleColor}
            onChange={(value) => updateConfig('mainTitleColor', value)}
            label="제목"
          />
          <ToolbarColorPicker
            value={config.contentColor}
            onChange={(value) => updateConfig('contentColor', value)}
            label="내용"
          />
          <ToolbarToggle
            checked={config.textShadow}
            onChange={(checked) => updateConfig('textShadow', checked)}
            label="그림자"
          />
        </ToolbarSection>

        {/* 보기 옵션 섹션 */}
        <ToolbarSection>
          <ToolbarButton
            active={showCode}
            onClick={() => setShowCode(!showCode)}
            tooltip="코드 보기"
          >
            {showCode ? <Eye className="w-4 h-4" /> : <Code className="w-4 h-4" />}
          </ToolbarButton>
          <ToolbarButton
            onClick={() => setShowMoreOptions(!showMoreOptions)}
            tooltip="추가 옵션"
          >
            <MoreVertical className="w-4 h-4" />
          </ToolbarButton>
        </ToolbarSection>

        {/* 다운로드 섹션 */}
        <ToolbarSection className="ml-auto border-r-0">
          <Button
            onClick={handleDownload}
            disabled={isDownloading}
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            {isDownloading ? '생성 중...' : '다운로드'}
          </Button>
        </ToolbarSection>
          </Toolbar>

          {/* 두 번째 줄 */}
          <Toolbar className="border-t border-gray-100">
            {/* 표시 요소 섹션 */}
            <ToolbarSection>
              <span className="text-sm text-gray-600 font-medium">표시:</span>
              <ToolbarToggle
                checked={config.showEmoji}
                onChange={(checked) => updateConfig('showEmoji', checked)}
                label="이모지"
              />
              <ToolbarToggle
                checked={config.showHashtags}
                onChange={(checked) => updateConfig('showHashtags', checked)}
                label="해시태그"
              />
              <ToolbarToggle
                checked={config.showCTA}
                onChange={(checked) => updateConfig('showCTA', checked)}
                label="CTA 버튼"
              />
              <ToolbarToggle
                checked={config.showWatermark}
                onChange={(checked) => updateConfig('showWatermark', checked)}
                label="워터마크"
              />
              {config.showWatermark && (
                <input
                  type="text"
                  value={config.watermarkText}
                  onChange={(e) => updateConfig('watermarkText', e.target.value)}
                  placeholder="워터마크 텍스트"
                  className="px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 w-32"
                />
              )}
              <ToolbarToggle
              />
            </ToolbarSection>

            {/* 효과 조절 섹션 */}
            <ToolbarSection>
              <ToolbarSlider
                label="블러"
                value={config.blur}
                onChange={(value) => updateConfig('blur', value)}
                min={0}
                max={20}
                step={1}
                unit="px"
              />
              <ToolbarSlider
                label="투명도"
                value={config.opacity}
                onChange={(value) => updateConfig('opacity', value)}
                min={0}
                max={100}
                step={5}
                unit="%"
              />
            </ToolbarSection>

          </Toolbar>
        </div>

        {/* 추가 옵션 툴바 */}
        {showMoreOptions && (
          <Toolbar className="flex-none border-t bg-gray-50">
            <ToolbarSection>
              <input
                type="text"
                value={config.emoji}
                onChange={(e) => updateConfig('emoji', e.target.value)}
                className="px-2 py-1 border rounded text-sm w-16"
                placeholder="이모지"
              />
              <input
                type="text"
                value={config.mainTitle}
                onChange={(e) => updateConfig('mainTitle', e.target.value)}
                className="px-2 py-1 border rounded text-sm w-48"
                placeholder="메인 타이틀"
              />
              <textarea
                value={config.contentText}
                onChange={(e) => updateConfig('contentText', e.target.value)}
                className="px-2 py-1 border rounded text-sm w-64 h-20"
                placeholder="콘텐츠 텍스트"
              />
              <input
                type="text"
                value={config.ctaText}
                onChange={(e) => updateConfig('ctaText', e.target.value)}
                className="px-2 py-1 border rounded text-sm w-32"
                placeholder="CTA 텍스트"
              />
              <input
                type="text"
                value={config.hashtags}
                onChange={(e) => updateConfig('hashtags', e.target.value)}
                className="px-2 py-1 border rounded text-sm w-64"
                placeholder="해시태그"
              />
            </ToolbarSection>
          </Toolbar>
        )}

        {/* 메인 컨텐츠 영역 - 완전히 분리된 영역 */}
        <div className="flex-1 flex items-center justify-center p-8 bg-gray-50 overflow-auto">
        {!showCode ? (
          <div className="w-full max-w-2xl">
            {/* 인스타그램 카드 (1:1) */}
            <Card 
              ref={cardRef} 
              className="relative w-full aspect-square overflow-hidden shadow-2xl"
            >
              {/* 배경 레이어 */}
              <div 
                className="absolute inset-0"
                style={{
                  ...getBackgroundStyle(),
                  filter: config.blur > 0 ? `blur(${config.blur}px)` : 'none',
                  opacity: config.opacity / 100
                }}
              />
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
                        &ldquo;
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
              {config.showWatermark && (
                <Watermark position="bottom-right" opacity={0.8} size="small" text={config.watermarkText} />
              )}
            </Card>
          </div>
        ) : (
          <div className="w-full max-w-4xl">
            <Card className="p-6 bg-gray-900 text-white">
              <pre className="overflow-x-auto">
                <code>{generateCode()}</code>
              </pre>
            </Card>
          </div>
        )}
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
      </div>
      
      {/* AI 어시스턴트 */}
      <AIAssistant 
        currentDesignCode={config as unknown as Record<string, unknown>}
        onApplyChanges={(newConfig) => setConfig(newConfig as unknown as InstagramConfig)}
        templateType="Instagram 카드뉴스"
        isExpanded={isAIExpanded}
        onToggleExpanded={setIsAIExpanded}
      />
    </div>
  )
}
"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Watermark from "@/components/watermark"
import { 
  Download, Play, Clock, Eye, Code,
  Upload, MoreVertical
} from "lucide-react"
import { 
  Toolbar, 
  ToolbarSection, 
  ToolbarButton, 
  ToolbarSelect,
  ToolbarColorPicker,
  
  ToolbarSlider
} from "@/components/ui/toolbar"
import { toPng } from "html-to-image"
import { useRef, useState } from "react"
import AIAssistant from "@/components/ai-assistant"

interface YoutubeConfig {
  mainText: string
  subText: string
  emoji: string
  badge: string
  showEmoji: boolean
  showBadge: boolean
  showArrow: boolean
  showDuration: boolean
  showWatermark: boolean
  watermarkText: string
  duration: string
  views: string
  textColor: string
  bgColor: string
  bgType: 'solid' | 'gradient' | 'image'
  bgGradientStart: string
  bgGradientEnd: string
  accentColor: string
  fontSize: string
  fontWeight: string
  fontFamily: string
  blur: number  // 블러 효과 (0-20)
  opacity: number  // 투명도 (0-100)
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
  showWatermark: true,
  watermarkText: 'service-image.vercel.app',
  duration: "10:23",
  views: "조회수 1.2만회",
  textColor: "#ffffff",
  bgColor: "#ff0000",
  bgType: 'gradient',
  bgGradientStart: "#dc2626",
  bgGradientEnd: "#9333ea",
  accentColor: "#fbbf24",
  fontSize: "text-6xl",
  fontWeight: "font-black",
  fontFamily: "pretendard",
  blur: 0,
  opacity: 100
}

export default function YoutubeTemplateV2() {
  const cardRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [config, setConfig] = useState<YoutubeConfig>(defaultConfig)
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
        backgroundColor: '#000000',
        skipFonts: true,
        filter: (node) => {
          if (node.tagName === 'LINK' && node.getAttribute('rel') === 'stylesheet') {
            return false
          }
          return true
        }
      })
      
      const fileName = `youtube-thumbnail-${Date.now()}.png`
      
      // iOS 기기 감지
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
      
      if (isIOS) {
        // iOS에서는 새 탭에서 이미지 열기
        const newTab = window.open('', '_blank')
        if (newTab) {
          newTab.document.write(`
            <html>
              <head>
                <title>${fileName}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                  body { margin: 0; padding: 20px; background: #f0f0f0; text-align: center; font-family: -apple-system, BlinkMacSystemFont, sans-serif; }
                  img { max-width: 100%; height: auto; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border-radius: 8px; }
                  .download-hint { margin: 20px; padding: 15px; background: #007AFF; color: white; border-radius: 8px; }
                </style>
              </head>
              <body>
                <div class="download-hint">이미지를 길게 눌러 저장하세요</div>
                <img src="${dataUrl}" alt="${fileName}"/>
              </body>
            </html>
          `)
          newTab.document.close()
        }
      } else {
        // 일반 브라우저에서는 다운로드
        const link = document.createElement('a')
        link.download = fileName
        link.href = dataUrl
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    } catch (error) {
      console.error('Failed to generate image:', error)
      alert('이미지 생성에 실패했습니다. 다시 시도해 주세요.')
    } finally {
      setIsDownloading(false)
    }
  }

  const updateConfig = (key: keyof YoutubeConfig, value: string | boolean | number) => {
    setConfig({ ...config, [key]: value })
  }

  // 배경 스타일 계산
  const getBackgroundStyle = () => {
    if (config.bgType === 'solid') {
      return { backgroundColor: config.bgColor }
    } else if (config.bgType === 'gradient') {
      return {
        background: `linear-gradient(to bottom right, ${config.bgGradientStart}, ${config.bgGradientEnd})`
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

  // 코드 생성
  const generateCode = () => {
    return `<!-- YouTube Thumbnail HTML/CSS -->
<div class="thumbnail" style="${JSON.stringify(getBackgroundStyle(), null, 2).replace(/[{}]/g, '').replace(/"/g, '')}">
  ${config.showBadge ? `
  <div class="badge" style="
    background-color: ${config.accentColor};
    color: #000;
    padding: 8px 16px;
    border-radius: 8px;
    font-weight: bold;
    position: absolute;
    top: 16px;
    left: 16px;
  ">${config.badge}</div>` : ''}
  
  ${config.showEmoji ? `
  <div class="emoji" style="
    font-size: 80px;
    animation: bounce 1s infinite;
  ">${config.emoji}</div>` : ''}
  
  <h1 style="
    font-size: ${config.fontSize};
    font-weight: ${config.fontWeight};
    color: ${config.textColor};
    text-shadow: 4px 4px 8px rgba(0,0,0,0.5);
  ">${config.mainText}</h1>
  
  <p style="
    font-size: 30px;
    color: ${config.textColor};
    font-weight: bold;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
  ">${config.subText}</p>
  
  ${config.showDuration ? `
  <div class="duration" style="
    background: rgba(0,0,0,0.8);
    color: white;
    padding: 4px 12px;
    border-radius: 6px;
    position: absolute;
    bottom: 16px;
    right: 16px;
  ">${config.duration}</div>` : ''}
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
            {/* 배경 섹션 */}
            <ToolbarSection>
              <span className="text-sm text-gray-600 font-medium">배경:</span>
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

            {/* 텍스트 스타일 섹션 */}
            <ToolbarSection>
              <ToolbarColorPicker
                value={config.textColor}
                onChange={(value) => updateConfig('textColor', value)}
                label="텍스트"
              />
              <ToolbarColorPicker
                value={config.accentColor}
                onChange={(value) => updateConfig('accentColor', value)}
                label="액센트"
              />
              <ToolbarSelect
                value={config.fontSize}
                onChange={(value) => updateConfig('fontSize', value)}
                options={[
                  { value: 'text-5xl', label: '보통' },
                  { value: 'text-6xl', label: '크게' },
                  { value: 'text-7xl', label: '매우 크게' },
                  { value: 'text-8xl', label: '초대형' }
                ]}
                label="크기"
              />
            </ToolbarSection>

            {/* 다운로드 섹션 */}
            <ToolbarSection className="ml-auto border-r-0">
              <Button
                onClick={handleDownload}
                disabled={isDownloading}
                className="bg-gradient-to-r from-red-500 to-purple-500 hover:from-red-600 hover:to-purple-600 text-white"
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
              {config.showWatermark && (
                <input
                  type="text"
                  value={config.watermarkText}
                  onChange={(e) => updateConfig('watermarkText', e.target.value)}
                  placeholder="워터마크 텍스트"
                  className="px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 w-32"
                />
              )}
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

            {/* 보기 옵션 섹션 */}
            <ToolbarSection className="ml-auto">
              <ToolbarButton
                active={showCode}
                onClick={() => setShowCode(!showCode)}
                tooltip="코드 보기"
              >
                {showCode ? <Eye className="w-4 h-4" /> : <Code className="w-4 h-4" />}
                <span className="ml-1">코드</span>
              </ToolbarButton>
              <ToolbarButton
                onClick={() => setShowMoreOptions(!showMoreOptions)}
                tooltip="추가 옵션"
              >
                <MoreVertical className="w-4 h-4" />
                <span className="ml-1">더보기</span>
              </ToolbarButton>
            </ToolbarSection>
          </Toolbar>
        </div>

        {/* 추가 옵션 툴바 */}
        {showMoreOptions && (
          <Toolbar className="flex-none border-t bg-gray-50">
          <ToolbarSection>
            <input
              type="text"
              value={config.mainText}
              onChange={(e) => updateConfig('mainText', e.target.value)}
              className="px-2 py-1 border rounded text-sm w-48"
              placeholder="메인 텍스트"
            />
            <input
              type="text"
              value={config.subText}
              onChange={(e) => updateConfig('subText', e.target.value)}
              className="px-2 py-1 border rounded text-sm w-48"
              placeholder="서브 텍스트"
            />
            <input
              type="text"
              value={config.emoji}
              onChange={(e) => updateConfig('emoji', e.target.value)}
              className="px-2 py-1 border rounded text-sm w-16"
              placeholder="이모지"
            />
            <input
              type="text"
              value={config.badge}
              onChange={(e) => updateConfig('badge', e.target.value)}
              className="px-2 py-1 border rounded text-sm w-24"
              placeholder="뱃지"
            />
            <input
              type="text"
              value={config.duration}
              onChange={(e) => updateConfig('duration', e.target.value)}
              className="px-2 py-1 border rounded text-sm w-24"
              placeholder="시간"
            />
          </ToolbarSection>
        </Toolbar>
        )}

        {/* 메인 컨텐츠 영역 - 완전히 분리된 영역 */}
        <div className="flex-1 flex items-center justify-center p-8 bg-gray-50 overflow-auto">
        {!showCode ? (
          <div className="w-full max-w-4xl">
            {/* 유튜브 썸네일 카드 (16:9) */}
            <Card 
              ref={cardRef} 
              className="relative w-full aspect-[16/9] overflow-hidden shadow-2xl"
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
              
              {/* 커스텀 배경 이미지일 때 오버레이 */}
              {config.bgType === 'image' && customBgImage && (
                <div className="absolute inset-0 bg-black/30" style={{ opacity: config.opacity / 100 }} />
              )}

              {/* 뱃지 */}
              {config.showBadge && (
                <div className="absolute top-[3%] left-[3%] z-20">
                  <div className="px-[2%] py-[1%] rounded-lg font-black shadow-lg"
                       style={{ 
                         backgroundColor: config.accentColor, 
                         color: '#000',
                         fontSize: 'clamp(0.875rem, 2.5vw, 1.25rem)'
                       }}>
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
                    <div className="text-8xl mb-4">
                      {config.emoji}
                    </div>
                  )}
                  
                  {/* 메인 텍스트 */}
                  <h1 style={{
                        fontSize: config.mainText.length > 15 ? '2.5rem' :
                                 config.fontSize === 'text-5xl' ? '3rem' : 
                                 config.fontSize === 'text-6xl' ? '3.75rem' : 
                                 config.fontSize === 'text-7xl' ? '4.5rem' : '6rem',
                        fontWeight: config.fontWeight === 'font-bold' ? '700' : 
                                   config.fontWeight === 'font-extrabold' ? '800' : '900',
                        color: config.textColor,
                        fontFamily: 'Pretendard, sans-serif',
                        textShadow: '4px 4px 8px rgba(0,0,0,0.5)',
                        marginBottom: '1rem',
                        lineHeight: '1.2',
                        whiteSpace: config.mainText.length > 20 ? 'normal' : 'nowrap',
                        wordBreak: 'keep-all',
                        display: 'block',
                        textAlign: 'center'
                      }}>
                    {config.mainText}
                  </h1>
                  
                  {/* 서브 텍스트 */}
                  {config.subText && (
                    <p style={{
                         fontSize: '1.875rem',
                         fontWeight: '700',
                         color: config.textColor,
                         textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                         whiteSpace: 'nowrap',
                         display: 'block'
                       }}>
                      {config.subText}
                    </p>
                  )}
                </div>
              </div>

              {/* 유튜브 플레이 버튼 오버레이 */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                <Play className="w-32 h-32 text-white fill-white" />
              </div>
              
              {/* 워터마크 */}
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
        onApplyChanges={(newConfig) => setConfig(newConfig as unknown as YoutubeConfig)}
        templateType="YouTube 썸네일"
        isExpanded={isAIExpanded}
        onToggleExpanded={setIsAIExpanded}
      />
    </div>
  )
}
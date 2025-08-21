"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Monitor, Sparkles, Zap, Globe, Layout, Download,
  Upload, Code, Eye, MoreVertical
} from "lucide-react"
import { 
  Toolbar, 
  ToolbarSection, 
  ToolbarButton, 
  ToolbarSelect,
  ToolbarColorPicker,
  ToolbarToggle
} from "@/components/ui/toolbar"
import { toPng } from "html-to-image"
import { useRef, useState, useEffect } from "react"
import AIAssistant from "@/components/ai-assistant"

type ThemeStyle = 'gradient' | 'neon' | 'glassmorphism' | 'minimal' | 'retrowave' | 'dark'

interface DesignConfig {
  theme: ThemeStyle
  showBrowserUI: boolean
  showHeroIcon: boolean
  showSubtitle: boolean
  showIconCards: boolean
  showBottomSection: boolean
  showSparkles: boolean
  mainTitleTop: string
  mainTitleBottom: string
  subtitleTop: string
  subtitleBottom: string
  urlText: string
  mainTitleSize: string
  subtitleSize: string
  fontWeight: string
  fontFamily: string
  cropOptimized: boolean
  bgType: 'theme' | 'image'
  textColor: string
  accentColor: string
}

const defaultConfig: DesignConfig = {
  theme: 'neon',
  showBrowserUI: true,
  showHeroIcon: true,
  showSubtitle: true,
  showIconCards: true,
  showBottomSection: false,
  showSparkles: true,
  mainTitleTop: "초고속",
  mainTitleBottom: "랜딩페이지 제작",
  subtitleTop: "오늘 문의, 내일 완성",
  subtitleBottom: "결과 보고 결제!",
  urlText: "your-landing-page.com",
  mainTitleSize: "text-5xl md:text-7xl",
  subtitleSize: "text-2xl md:text-3xl",
  fontWeight: "font-black",
  fontFamily: "pretendard",
  cropOptimized: false,
  bgType: 'theme',
  textColor: '#ffffff',
  accentColor: '#3b82f6'
}

const themeStyles = {
  gradient: {
    bg: "bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500",
    text: "text-white",
    accent: "bg-white/20 backdrop-blur-md",
    glow: ""
  },
  neon: {
    bg: "bg-black",
    text: "text-cyan-400",
    accent: "bg-cyan-900/30 border border-cyan-400",
    glow: "drop-shadow-[0_0_35px_rgba(6,182,212,0.8)]"
  },
  glassmorphism: {
    bg: "bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400",
    text: "text-white",
    accent: "bg-white/10 backdrop-blur-lg border border-white/20",
    glow: ""
  },
  minimal: {
    bg: "bg-white",
    text: "text-gray-900",
    accent: "bg-gray-100 border border-gray-200",
    glow: ""
  },
  retrowave: {
    bg: "bg-gradient-to-b from-purple-900 via-pink-800 to-orange-700",
    text: "text-yellow-300",
    accent: "bg-purple-900/50 border-2 border-yellow-300",
    glow: "drop-shadow-[0_0_20px_rgba(253,224,71,0.5)]"
  },
  dark: {
    bg: "bg-gray-900",
    text: "text-gray-100",
    accent: "bg-gray-800 border border-gray-700",
    glow: ""
  }
}

export default function LandingThumbnailV2() {
  const cardRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [config, setConfig] = useState<DesignConfig>(defaultConfig)
  const [customBgImage, setCustomBgImage] = useState<string | null>(null)
  const [showCode, setShowCode] = useState(false)
  const [showMoreOptions, setShowMoreOptions] = useState(false)
  const [isAIExpanded, setIsAIExpanded] = useState(false)

  // Web fonts 로드
  useEffect(() => {
    const loadFonts = () => {
      const link = document.createElement('link')
      link.href = 'https://fonts.googleapis.com/css2?family=Nanum+Gothic:wght@400;700;800&family=Noto+Sans+KR:wght@400;700;900&display=swap'
      link.rel = 'stylesheet'
      document.head.appendChild(link)

      // SUITE 폰트
      const suiteLink = document.createElement('link')
      suiteLink.href = 'https://cdn.jsdelivr.net/gh/sunn-us/SUITE/fonts/variable/woff2/SUITE-Variable.css'
      suiteLink.rel = 'stylesheet'
      document.head.appendChild(suiteLink)

      // Gmarket Sans
      const gmarketLink = document.createElement('link')
      gmarketLink.href = 'https://webfontworld.github.io/gmarket/GmarketSans.css'
      gmarketLink.rel = 'stylesheet'
      document.head.appendChild(gmarketLink)

      // Spoqa Han Sans Neo
      const spoqaLink = document.createElement('link')
      spoqaLink.href = 'https://spoqa.github.io/spoqa-han-sans/css/SpoqaHanSansNeo.css'
      spoqaLink.rel = 'stylesheet'
      document.head.appendChild(spoqaLink)
    }

    loadFonts()
  }, [])

  const getFontStyle = () => {
    const fontMap: { [key: string]: string } = {
      'pretendard': 'Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif',
      'suite': 'SUITE, Pretendard, sans-serif',
      'nanum': 'Nanum Gothic, Pretendard, sans-serif',
      'noto': 'Noto Sans KR, Pretendard, sans-serif',
      'gothic': 'Malgun Gothic, 맑은 고딕, Pretendard, sans-serif',
      'gmarket': 'GmarketSans, Pretendard, sans-serif',
      'spoqa': 'Spoqa Han Sans Neo, Pretendard, sans-serif'
    }
    return fontMap[config.fontFamily] || fontMap['pretendard']
  }

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
      link.download = `landing-service-${Date.now()}.png`
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error('Failed to generate image:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  const updateConfig = (key: keyof DesignConfig, value: string | boolean) => {
    setConfig({ ...config, [key]: value })
  }

  const currentTheme = config.bgType === 'theme' ? themeStyles[config.theme] : null

  const generateCode = () => {
    return `<!-- Landing Page Thumbnail HTML/CSS -->
<div class="landing-card ${config.bgType === 'theme' ? config.theme : 'custom'}">
  ${config.showBrowserUI ? `
  <div class="browser-ui">
    <div class="browser-dots">
      <span class="dot red"></span>
      <span class="dot yellow"></span>
      <span class="dot green"></span>
    </div>
    <div class="url-bar">${config.urlText}</div>
  </div>` : ''}
  
  <div class="content">
    ${config.showHeroIcon ? `
    <div class="hero-icon">
      ${config.theme === 'neon' ? '💻' : '🚀'}
    </div>` : ''}
    
    <h1 class="${config.mainTitleSize} ${config.fontWeight}">
      <span class="highlight">${config.mainTitleTop}</span>
      <br />
      ${config.mainTitleBottom}
    </h1>
    
    ${config.showSubtitle ? `
    <div class="subtitle ${config.subtitleSize}">
      <p>${config.subtitleTop}</p>
      <p class="highlight">${config.subtitleBottom}</p>
    </div>` : ''}
    
    ${config.showIconCards ? `
    <div class="features">
      <div class="feature-card">
        <span class="icon">⚡</span>
        <span>초고속 제작</span>
      </div>
      <div class="feature-card">
        <span class="icon">🎨</span>
        <span>맞춤 디자인</span>
      </div>
      <div class="feature-card">
        <span class="icon">📱</span>
        <span>반응형 지원</span>
      </div>
    </div>` : ''}
    
    ${config.showBottomSection ? `
    <div class="code-preview">
      <code>
        const landing = await create({
          design: "premium",
          speed: "1day",
          satisfaction: "100%"
        });
      </code>
    </div>` : ''}
  </div>
  
  ${config.showSparkles ? `
  <div class="sparkles">✨</div>` : ''}
</div>

<style>
  .landing-card {
    ${config.bgType === 'theme' ? 
      `.${config.theme} { ${currentTheme?.bg} }` : 
      `background-image: url('${customBgImage}');`
    }
    color: ${config.textColor};
  }
  
  .highlight {
    color: ${config.accentColor};
  }
  
  .feature-card {
    ${currentTheme?.accent || ''}
  }
</style>`
  }

  return (
    <div className="flex h-full">
      {/* 메인 컨텐츠 영역 */}
      <div className={`flex flex-col flex-1 transition-all duration-300 ${isAIExpanded ? 'mr-96' : 'mr-0'}`}>
        {/* 상단 툴바 컨테이너 */}
        <div className="flex-none bg-white border-b-2 border-gray-200 shadow-md">
          {/* 첫 번째 줄 */}
          <Toolbar className="border-b-0">
        {/* 테마 섹션 */}
        <ToolbarSection>
          <span className="text-sm text-gray-600">테마:</span>
          <ToolbarSelect
            value={config.theme}
            onChange={(value) => updateConfig('theme', value as ThemeStyle)}
            options={[
              { value: 'gradient', label: '그라데이션' },
              { value: 'neon', label: '네온' },
              { value: 'glassmorphism', label: '글래스' },
              { value: 'minimal', label: '미니멀' },
              { value: 'retrowave', label: '레트로' },
              { value: 'dark', label: '다크' }
            ]}
          />
          <ToolbarButton 
            onClick={() => fileInputRef.current?.click()}
            active={config.bgType === 'image'}
          >
            <Upload className="w-4 h-4" />
            배경 이미지
          </ToolbarButton>
        </ToolbarSection>

        {/* 색상 섹션 */}
        <ToolbarSection>
          <ToolbarColorPicker
            value={config.textColor}
            onChange={(value) => updateConfig('textColor', value)}
            label="텍스트"
          />
          <ToolbarColorPicker
            value={config.accentColor}
            onChange={(value) => updateConfig('accentColor', value)}
            label="강조"
          />
        </ToolbarSection>

        {/* 폰트 섹션 */}
        <ToolbarSection>
          <ToolbarSelect
            value={config.fontFamily}
            onChange={(value) => updateConfig('fontFamily', value)}
            options={[
              { value: 'pretendard', label: 'Pretendard' },
              { value: 'suite', label: 'SUITE' },
              { value: 'nanum', label: '나눔고딕' },
              { value: 'noto', label: 'Noto Sans' },
              { value: 'gmarket', label: 'G마켓 산스' },
              { value: 'spoqa', label: 'Spoqa' }
            ]}
            label="폰트"
          />
          <ToolbarSelect
            value={config.fontWeight}
            onChange={(value) => updateConfig('fontWeight', value)}
            options={[
              { value: 'font-bold', label: '볼드' },
              { value: 'font-black', label: '블랙' },
              { value: 'font-extrabold', label: '엑스트라' }
            ]}
            label="굵기"
          />
        </ToolbarSection>


        {/* 다운로드 섹션 */}
        <ToolbarSection className="border-r-0">
          <Button
            onClick={handleDownload}
            disabled={isDownloading}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
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
                checked={config.showBrowserUI}
                onChange={(checked) => updateConfig('showBrowserUI', checked)}
                label="브라우저"
              />
              <ToolbarToggle
                checked={config.showHeroIcon}
                onChange={(checked) => updateConfig('showHeroIcon', checked)}
                label="아이콘"
              />
              <ToolbarToggle
                checked={config.showIconCards}
                onChange={(checked) => updateConfig('showIconCards', checked)}
                label="카드"
              />
              <ToolbarToggle
                checked={config.showSubtitle}
                onChange={(checked) => updateConfig('showSubtitle', checked)}
                label="서브타이틀"
              />
              <ToolbarToggle
                checked={config.showBottomSection}
                onChange={(checked) => updateConfig('showBottomSection', checked)}
                label="코드섹션"
              />
              <ToolbarToggle
                checked={config.showSparkles}
                onChange={(checked) => updateConfig('showSparkles', checked)}
                label="반짝임"
              />
            </ToolbarSection>

            {/* 보기 옵션 섹션 */}
            <ToolbarSection className="ml-auto">
              <ToolbarToggle
                checked={config.cropOptimized}
                onChange={(checked) => updateConfig('cropOptimized', checked)}
                label="정사각형"
              />
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
              value={config.mainTitleTop}
              onChange={(e) => updateConfig('mainTitleTop', e.target.value)}
              className="px-2 py-1 border rounded text-sm w-32"
              placeholder="메인 제목 상단"
            />
            <input
              type="text"
              value={config.mainTitleBottom}
              onChange={(e) => updateConfig('mainTitleBottom', e.target.value)}
              className="px-2 py-1 border rounded text-sm w-32"
              placeholder="메인 제목 하단"
            />
            <input
              type="text"
              value={config.subtitleTop}
              onChange={(e) => updateConfig('subtitleTop', e.target.value)}
              className="px-2 py-1 border rounded text-sm w-32"
              placeholder="서브 제목 상단"
            />
            <input
              type="text"
              value={config.subtitleBottom}
              onChange={(e) => updateConfig('subtitleBottom', e.target.value)}
              className="px-2 py-1 border rounded text-sm w-32"
              placeholder="서브 제목 하단"
            />
            <input
              type="text"
              value={config.urlText}
              onChange={(e) => updateConfig('urlText', e.target.value)}
              className="px-2 py-1 border rounded text-sm w-48"
              placeholder="URL 텍스트"
            />
          </ToolbarSection>
        </Toolbar>
      )}

      {/* 메인 컨텐츠 영역 */}
      <div className={`flex-1 flex items-center justify-center p-8 overflow-auto ${
        config.theme === 'neon' ? 'bg-black' : 'bg-gray-50'
      }`}>
        {!showCode ? (
          <div className={`w-full ${config.cropOptimized ? 'max-w-2xl' : 'max-w-4xl'}`}>
            {/* 썸네일 카드 */}
            <Card 
              ref={cardRef} 
              className={`relative overflow-hidden shadow-2xl ${
                config.cropOptimized ? 'aspect-square' : 'aspect-[16/9]'
              } ${config.bgType === 'theme' ? currentTheme?.bg : ''}`}
              style={config.bgType === 'image' && customBgImage ? {
                backgroundImage: `url(${customBgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              } : {}}
            >
              {/* 네온 배경 효과 */}
              {config.theme === 'neon' && config.bgType === 'theme' && (
                <>
                  <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-black to-blue-900/20" />
                    <div 
                      className="absolute inset-0 opacity-30"
                      style={{
                        backgroundImage: `linear-gradient(cyan 1px, transparent 1px), linear-gradient(90deg, cyan 1px, transparent 1px)`,
                        backgroundSize: '50px 50px',
                      }}
                    />
                  </div>
                  <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-[120px] animate-pulse" />
                  <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-[120px] animate-pulse delay-700" />
                </>
              )}
              {/* 브라우저 UI */}
              {config.showBrowserUI && (
                <div className="absolute top-0 left-0 w-full p-4">
                  <div className={`${
                    config.theme === 'neon' ? 'bg-black/60 border-cyan-500/30 shadow-[0_0_15px_rgba(0,255,255,0.3)]' : 
                    config.theme === 'glassmorphism' ? 'bg-white/10 border-white/20' :
                    config.theme === 'minimal' ? 'bg-white border-gray-200' :
                    config.theme === 'retrowave' ? 'bg-purple-900/40 border-pink-500/50 shadow-[0_0_20px_rgba(255,0,255,0.3)]' :
                    config.theme === 'dark' ? 'bg-gray-800/60 border-gray-700' :
                    'bg-white/10 border-white/20'
                  } backdrop-blur-md rounded-t-lg p-2 border`}>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className={`w-3 h-3 rounded-full bg-red-500 ${
                          config.theme === 'neon' || config.theme === 'retrowave' ? 'shadow-[0_0_10px_rgba(255,0,0,0.7)]' : ''
                        }`} />
                        <div className={`w-3 h-3 rounded-full bg-yellow-500 ${
                          config.theme === 'neon' || config.theme === 'retrowave' ? 'shadow-[0_0_10px_rgba(255,255,0,0.7)]' : ''
                        }`} />
                        <div className={`w-3 h-3 rounded-full bg-green-500 ${
                          config.theme === 'neon' || config.theme === 'retrowave' ? 'shadow-[0_0_10px_rgba(0,255,0,0.7)]' : ''
                        }`} />
                      </div>
                      <div className={`flex-1 ${
                        config.theme === 'neon' ? 'bg-black/40 border-cyan-500/20' : 
                        config.theme === 'minimal' ? 'bg-gray-50 border-gray-200' :
                        config.theme === 'retrowave' ? 'bg-purple-900/30 border-pink-500/30' :
                        config.theme === 'dark' ? 'bg-gray-900/50 border-gray-700' :
                        'bg-white/10'
                      } rounded-md h-6 flex items-center px-3 border`}>
                        <Globe className={`w-3 h-3 ${
                          config.theme === 'neon' ? 'text-cyan-400' : 
                          config.theme === 'minimal' ? 'text-gray-500' :
                          config.theme === 'retrowave' ? 'text-pink-300' :
                          config.theme === 'dark' ? 'text-gray-400' :
                          'text-white/60'
                        } mr-2`} />
                        <span className={`text-xs ${
                          config.theme === 'neon' ? 'text-cyan-400' : 
                          config.theme === 'minimal' ? 'text-gray-500' :
                          config.theme === 'retrowave' ? 'text-pink-300' :
                          config.theme === 'dark' ? 'text-gray-400' :
                          'text-white/60'
                        }`}>{config.urlText}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 메인 컨텐츠 */}
              <div className={`${config.showBrowserUI ? 'pt-16' : ''} p-8 md:p-12 h-full flex flex-col justify-center items-center text-center relative`}>
                {/* 히어로 아이콘 */}
                {config.showHeroIcon && (
                  <div className="flex justify-center mb-6">
                    {config.theme === 'neon' ? (
                      <div className="relative">
                        <Zap className="w-24 h-24 text-cyan-400 drop-shadow-2xl animate-pulse" />
                        <Zap className="w-24 h-24 text-cyan-400 absolute inset-0 blur-xl animate-pulse" />
                      </div>
                    ) : config.theme === 'retrowave' ? (
                      <div className="relative">
                        <Zap className="w-24 h-24 text-pink-300 drop-shadow-[0_0_20px_rgba(255,0,255,0.8)] animate-pulse" />
                      </div>
                    ) : (
                      <div className={`text-6xl md:text-8xl ${currentTheme?.glow}`}>
                        <Monitor className={`w-24 h-24 ${config.bgType === 'theme' ? currentTheme?.text : ''}`} 
                                 style={config.bgType === 'image' ? { color: config.textColor } : {}} />
                      </div>
                    )}
                  </div>
                )}

                {/* 메인 타이틀 */}
                <h1 className={`${config.mainTitleSize} ${config.fontWeight} mb-4 ${
                  config.theme === 'neon' ? 'text-white' : config.bgType === 'theme' ? currentTheme?.text : ''
                } ${currentTheme?.glow}`}
                    style={{
                      fontFamily: getFontStyle(),
                      ...(config.bgType === 'image' ? { color: config.textColor } : {})
                    }}>
                  <span className={`${
                    config.theme === 'neon' ? 'bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(0,255,255,0.5)]' :
                    config.theme === 'retrowave' ? 'bg-gradient-to-r from-yellow-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent' :
                    config.theme === 'minimal' ? 'bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent' :
                    'bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent'
                  }`}
                        style={config.bgType === 'image' ? { color: config.accentColor } : {}}>
                    {config.mainTitleTop}
                  </span>
                  <br />
                  {config.mainTitleBottom}
                </h1>

                {/* 서브타이틀 */}
                {config.showSubtitle && (
                  <div className={`${config.subtitleSize} mb-8 ${
                    config.theme === 'neon' ? 'text-cyan-300' : config.bgType === 'theme' ? currentTheme?.text : ''
                  }`}
                       style={{
                         fontFamily: getFontStyle(),
                         ...(config.bgType === 'image' ? { color: config.textColor } : {})
                       }}>
                    <p className="mb-2">{config.subtitleTop}</p>
                    <p className={`font-bold ${
                      config.theme === 'neon' ? 'text-cyan-400 drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]' : ''
                    }`} 
                       style={config.bgType === 'image' ? { color: config.accentColor } : {}}>
                      {config.subtitleBottom}
                    </p>
                  </div>
                )}

                {/* 아이콘 카드 */}
                {config.showIconCards && (
                  <div className="flex gap-4 mb-8">
                    {[
                      { icon: <Zap className="w-6 h-6" />, text: "초고속 제작" },
                      { icon: <Layout className="w-6 h-6" />, text: "맞춤 디자인" },
                      { icon: <Globe className="w-6 h-6" />, text: "반응형 지원" }
                    ].map((item, index) => (
                      <div key={index} 
                           className={`px-4 py-3 rounded-lg flex items-center gap-2 ${
                             config.theme === 'neon' ? 'bg-cyan-900/30 border border-cyan-400/50 shadow-[0_0_10px_rgba(0,255,255,0.3)]' : 
                             currentTheme?.accent || ''
                           }`}>
                        <span className={`${
                          config.theme === 'neon' ? 'text-cyan-400' : config.bgType === 'theme' ? currentTheme?.text : ''
                        }`}
                              style={config.bgType === 'image' ? { color: config.textColor } : {}}>
                          {item.icon}
                        </span>
                        <span className={`text-sm font-medium ${
                          config.theme === 'neon' ? 'text-cyan-300' : config.bgType === 'theme' ? currentTheme?.text : ''
                        }`}
                              style={config.bgType === 'image' ? { color: config.textColor } : {}}>
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* 코드 섹션 */}
                {config.showBottomSection && (
                  <div className={`p-4 rounded-lg font-mono text-sm ${currentTheme?.accent}`}>
                    <code className={config.bgType === 'theme' ? currentTheme?.text : ''}
                          style={config.bgType === 'image' ? { color: config.textColor } : {}}>
                      {`const landing = await create({`}<br />
                      {`  design: "premium",`}<br />
                      {`  speed: "1day",`}<br />
                      {`  satisfaction: "100%"`}<br />
                      {`});`}
                    </code>
                  </div>
                )}

                {/* 반짝임 효과 */}
                {config.showSparkles && (
                  <>
                    <Sparkles className={`absolute top-1/4 right-1/4 w-8 h-8 animate-pulse ${
                      config.theme === 'neon' ? 'text-cyan-400 drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]' : 
                      config.bgType === 'theme' ? currentTheme?.text : ''
                    }`} style={config.bgType === 'image' ? { color: config.accentColor } : {}} />
                    <Sparkles className={`absolute bottom-1/3 left-1/3 w-6 h-6 animate-pulse ${
                      config.theme === 'neon' ? 'text-purple-400 drop-shadow-[0_0_10px_rgba(147,51,234,0.8)]' : 
                      config.bgType === 'theme' ? currentTheme?.text : ''
                    }`} style={config.bgType === 'image' ? { color: config.accentColor } : {}} />
                  </>
                )}
              </div>
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
        onApplyChanges={(newConfig) => setConfig(newConfig as unknown as DesignConfig)}
        templateType="IT 서비스"
        isExpanded={isAIExpanded}
        onToggleExpanded={setIsAIExpanded}
      />
    </div>
  )
}
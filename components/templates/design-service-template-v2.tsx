"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Download, Palette, Brush, PenTool, Layers, Sparkles, 
  Award, ArrowRight, Zap, Upload, Code, Eye, MoreVertical
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
import { useRef, useState } from "react"
import AIAssistant from "@/components/ai-assistant"

interface DesignConfig {
  mainTitle: string
  subtitle: string
  clientText: string
  processSteps: string[]
  portfolioCount: string
  showPortfolio: boolean
  showColorPalette: boolean
  showProcess: boolean
  showStats: boolean
  showTools: boolean
  showSparkles: boolean
  bgType: 'solid' | 'gradient' | 'image'
  bgColor: string
  bgGradientStart: string
  bgGradientEnd: string
  textColor: string
  accentColor: string
  fontSize: string
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
  showStats: true,
  showTools: true,
  showSparkles: true,
  bgType: 'gradient',
  bgColor: "#e9d5ff",
  bgGradientStart: "#e9d5ff",
  bgGradientEnd: "#fce7f3",
  textColor: "#111827",
  accentColor: "#9333ea",
  fontSize: "text-5xl"
}

export default function DesignServiceTemplateV2() {
  const cardRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [config, setConfig] = useState<DesignConfig>(defaultConfig)
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

  const generateCode = () => {
    return `<!-- Design Service Thumbnail HTML/CSS -->
<div class="design-card" style="${JSON.stringify(getBackgroundStyle(), null, 2).replace(/[{}]/g, '').replace(/"/g, '')}">
  ${config.showPortfolio ? `
  <div class="portfolio-grid">
    <div class="portfolio-item">🎨 Layers</div>
    <div class="portfolio-item">🖌️ Brush</div>
    <div class="portfolio-item">✏️ PenTool</div>
    <div class="portfolio-item">🎨 Palette</div>
  </div>` : ''}
  
  <div class="content">
    <h1 style="
      font-size: ${config.fontSize};
      color: ${config.textColor};
      white-space: pre-line;
    ">${config.mainTitle}</h1>
    
    <p style="color: ${config.textColor};">${config.subtitle}</p>
    
    ${config.showStats ? `
    <div class="stats">
      <span>🏆 ${config.portfolioCount}+ 프로젝트</span>
      <span>⚡ ${config.clientText}</span>
    </div>` : ''}
    
    ${config.showProcess ? `
    <div class="process">
      ${config.processSteps.map(step => 
        `<span style="background: ${config.accentColor}; color: white;">${step}</span>`
      ).join(' → ')}
    </div>` : ''}
    
    ${config.showTools ? `
    <div class="tools">
      <span>🎨</span>
      <span>✨</span>
      <span>💡</span>
    </div>` : ''}
  </div>
  
  ${config.showColorPalette ? `
  <div class="color-palette">
    <span class="color purple"></span>
    <span class="color pink"></span>
    <span class="color blue"></span>
    <span class="color yellow"></span>
  </div>` : ''}
</div>`
  }

  return (
    <div className="flex h-full">
      {/* 메인 컨텐츠 영역 */}
      <div className={`flex flex-col flex-1 transition-all duration-300 ${isAIExpanded ? 'mr-96' : 'mr-0'}`}>
        {/* 상단 툴바 컨테이너 */}
        <div className="flex-none bg-white border-b-2 border-gray-200 shadow-md">
          {/* 첫 번째 줄 */}
          <Toolbar className="border-b-0">
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
              { value: 'text-4xl', label: '보통' },
              { value: 'text-5xl', label: '크게' },
              { value: 'text-6xl', label: '매우 크게' }
            ]}
            label="크기"
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

        {/* 다운로드 섹션 */}
        <ToolbarSection className="border-r-0">
          <Button
            onClick={handleDownload}
            disabled={isDownloading}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
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
                checked={config.showPortfolio}
                onChange={(checked) => updateConfig('showPortfolio', checked)}
                label="포트폴리오"
              />
              <ToolbarToggle
                checked={config.showProcess}
                onChange={(checked) => updateConfig('showProcess', checked)}
                label="프로세스"
              />
              <ToolbarToggle
                checked={config.showStats}
                onChange={(checked) => updateConfig('showStats', checked)}
                label="통계"
              />
              <ToolbarToggle
                checked={config.showColorPalette}
                onChange={(checked) => updateConfig('showColorPalette', checked)}
                label="컬러팔레트"
              />
              <ToolbarToggle
                checked={config.showTools}
                onChange={(checked) => updateConfig('showTools', checked)}
                label="툴아이콘"
              />
              <ToolbarToggle
                checked={config.showSparkles}
                onChange={(checked) => updateConfig('showSparkles', checked)}
                label="반짝임"
              />
            </ToolbarSection>
          </Toolbar>
        </div>

        {/* 추가 옵션 툴바 */}
        {showMoreOptions && (
          <Toolbar className="flex-none border-t bg-gray-50">
          <ToolbarSection>
            <textarea
              value={config.mainTitle}
              onChange={(e) => updateConfig('mainTitle', e.target.value)}
              className="px-2 py-1 border rounded text-sm w-64 h-12 resize-none"
              placeholder="메인 타이틀 (줄바꿈 가능)"
            />
            <input
              type="text"
              value={config.subtitle}
              onChange={(e) => updateConfig('subtitle', e.target.value)}
              className="px-2 py-1 border rounded text-sm w-48"
              placeholder="서브타이틀"
            />
            <input
              type="text"
              value={config.processSteps.join(', ')}
              onChange={(e) => updateConfig('processSteps', e.target.value.split(',').map(s => s.trim()))}
              className="px-2 py-1 border rounded text-sm w-48"
              placeholder="프로세스 단계"
            />
            <input
              type="text"
              value={config.portfolioCount}
              onChange={(e) => updateConfig('portfolioCount', e.target.value)}
              className="px-2 py-1 border rounded text-sm w-24"
              placeholder="포트폴리오"
            />
            <input
              type="text"
              value={config.clientText}
              onChange={(e) => updateConfig('clientText', e.target.value)}
              className="px-2 py-1 border rounded text-sm w-32"
              placeholder="클라이언트"
            />
          </ToolbarSection>
        </Toolbar>
      )}

      {/* 메인 컨텐츠 영역 - 완전히 분리된 영역 */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50 overflow-auto">
        {!showCode ? (
          <div className="w-full max-w-4xl">
            {/* 디자인 서비스 썸네일 카드 (16:9) */}
            <Card 
              ref={cardRef} 
              className="relative w-full aspect-[16/9] overflow-hidden shadow-2xl"
              style={getBackgroundStyle()}
            >
              {/* 커스텀 배경 이미지일 때 오버레이 */}
              {config.bgType === 'image' && customBgImage && (
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
                  <h1 className={`${config.fontSize} font-black leading-tight whitespace-pre-line`}
                      style={{
                        color: config.textColor,
                        fontFamily: 'Pretendard, sans-serif',
                        textShadow: config.textColor === '#ffffff' ? '2px 2px 8px rgba(0,0,0,0.3)' : 'none'
                      }}>
                    {config.mainTitle}
                  </h1>
                  
                  {/* 서브타이틀 */}
                  <p className="text-2xl font-medium opacity-90"
                     style={{ color: config.textColor }}>
                    {config.subtitle}
                  </p>

                  {/* 통계 */}
                  {config.showStats && (
                    <div className="flex gap-6">
                      <div className="flex items-center gap-2">
                        <Award className="w-6 h-6" style={{ color: config.textColor }} />
                        <span className="font-bold text-xl" style={{ color: config.textColor }}>
                          {config.portfolioCount}+ 프로젝트
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="w-6 h-6" style={{ color: config.textColor }} />
                        <span className="font-bold text-xl" style={{ color: config.textColor }}>
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
                          <div className="px-4 py-2 text-white rounded-lg font-bold"
                               style={{ backgroundColor: config.accentColor }}>
                            {step}
                          </div>
                          {index < config.processSteps.length - 1 && (
                            <ArrowRight className="w-6 h-6 mx-2" style={{ color: config.textColor }} />
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 툴 아이콘 */}
                  {config.showTools && (
                    <div className="flex gap-3 mt-6">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                        <span className="text-2xl">🎨</span>
                      </div>
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                        <span className="text-2xl">✨</span>
                      </div>
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                        <span className="text-2xl">💡</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 장식 요소 */}
              {config.showSparkles && (
                <>
                  <Sparkles className="absolute top-1/2 right-1/4 w-12 h-12 text-yellow-400 opacity-60" />
                  <Sparkles className="absolute bottom-1/3 left-1/3 w-8 h-8 text-purple-400 opacity-60" />
                </>
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
        onApplyChanges={(newConfig) => setConfig(newConfig as unknown as DesignConfig)}
        templateType="디자인 서비스"
        isExpanded={isAIExpanded}
        onToggleExpanded={setIsAIExpanded}
      />
    </div>
  )
}
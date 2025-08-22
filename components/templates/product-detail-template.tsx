"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Download, Upload, Sparkles, Heart, Star, Check, 
  ArrowRight, Gift, Shield, Clock, Zap, Eye, Code
} from "lucide-react"
import { 
  Toolbar, 
  ToolbarSection, 
  ToolbarButton,
  ToolbarColorPicker,
  ToolbarToggle,
  ToolbarSlider,
  ToolbarSelect
} from "@/components/ui/toolbar"
import { toPng } from "html-to-image"
import { useRef, useState, useEffect } from "react"
import AIAssistant from "@/components/ai-assistant"

type LayoutStyle = 'hero' | 'split' | 'minimal' | 'premium' | 'story'

interface ProductDetailConfig {
  // 메인 콘텐츠
  headline: string
  subheadline: string
  mainBenefit1: string
  mainBenefit2: string
  mainBenefit3: string
  ctaText: string
  
  // 추가 텍스트
  testimonial: string
  guarantee: string
  urgencyText: string
  
  // 표시 요소
  showHeadline: boolean
  showBenefits: boolean
  showTestimonial: boolean
  showGuarantee: boolean
  showUrgency: boolean
  showCTA: boolean
  showProductImage: boolean
  showDecorations: boolean
  
  // 스타일
  layoutStyle: LayoutStyle
  bgType: 'solid' | 'gradient' | 'pattern'
  bgColor: string
  bgGradientStart: string
  bgGradientEnd: string
  primaryColor: string
  textColor: string
  accentColor: string
  fontStyle: 'modern' | 'elegant' | 'playful' | 'bold'
  
  // 이미지
  productImage: string | null
  
  // 효과
  blur: number
  opacity: number
}

const defaultConfig: ProductDetailConfig = {
  headline: "당신의 일상을\n특별하게 만들어줄",
  subheadline: "프리미엄 라이프스타일 제품",
  mainBenefit1: "✨ 하루 10분, 피부가 달라집니다",
  mainBenefit2: "💧 특허받은 3중 보습 시스템",
  mainBenefit3: "🌿 자연 유래 성분 95%",
  ctaText: "지금 구매하고 -50% 할인받기",
  testimonial: '"3일만에 피부 톤이 밝아진게 느껴져요!"',
  guarantee: "30일 100% 환불보장",
  urgencyText: "⏰ 오늘만 특가! 23시간 남음",
  
  showHeadline: true,
  showBenefits: true,
  showTestimonial: true,
  showGuarantee: true,
  showUrgency: true,
  showCTA: true,
  showProductImage: true,
  showDecorations: true,
  
  layoutStyle: 'hero',
  bgType: 'gradient',
  bgColor: '#ffffff',
  bgGradientStart: '#fef3c7',
  bgGradientEnd: '#fce7f3',
  primaryColor: '#ec4899',
  textColor: '#1f2937',
  accentColor: '#f59e0b',
  fontStyle: 'modern',
  
  productImage: null,
  blur: 0,
  opacity: 100
}

const layoutStyles = {
  hero: {
    name: '히어로',
    description: '큰 이미지와 임팩트 있는 헤드라인'
  },
  split: {
    name: '스플릿',
    description: '이미지와 텍스트 좌우 배치'
  },
  minimal: {
    name: '미니멀',
    description: '깔끔하고 여백이 많은 디자인'
  },
  premium: {
    name: '프리미엄',
    description: '고급스럽고 우아한 느낌'
  },
  story: {
    name: '스토리',
    description: '감성적인 스토리텔링 포커스'
  }
}

const fontStyles = {
  modern: { 
    heading: 'font-bold tracking-tight',
    body: 'font-medium'
  },
  elegant: { 
    heading: 'font-light tracking-wide',
    body: 'font-light'
  },
  playful: { 
    heading: 'font-black',
    body: 'font-semibold'
  },
  bold: { 
    heading: 'font-black uppercase',
    body: 'font-bold'
  }
}

export default function ProductDetailTemplate() {
  const cardRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [config, setConfig] = useState<ProductDetailConfig>(defaultConfig)
  const [isAIExpanded, setIsAIExpanded] = useState(false)
  const [showCode, setShowCode] = useState(false)

  // 웹 폰트 로드
  useEffect(() => {
    const loadFonts = () => {
      const link = document.createElement('link')
      link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Noto+Sans+KR:wght@300;400;500;700;900&display=swap'
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
        setConfig({ ...config, productImage: result })
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
        backgroundColor: '#ffffff'
      })
      
      const link = document.createElement('a')
      link.download = `product-detail-${Date.now()}.png`
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error('Failed to generate image:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  const updateConfig = (key: keyof ProductDetailConfig, value: any) => {
    setConfig({ ...config, [key]: value })
  }

  const getBackgroundStyle = () => {
    if (config.bgType === 'gradient') {
      return {
        background: `linear-gradient(135deg, ${config.bgGradientStart}, ${config.bgGradientEnd})`
      }
    } else if (config.bgType === 'pattern') {
      return {
        backgroundColor: config.bgColor,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${config.primaryColor.slice(1)}' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }
    }
    return { backgroundColor: config.bgColor }
  }

  const renderContent = () => {
    const fontStyle = fontStyles[config.fontStyle]
    
    switch(config.layoutStyle) {
      case 'hero':
        return (
          <>
            {/* 배경 레이어 */}
            <div 
              className="absolute inset-0"
              style={{
                ...getBackgroundStyle(),
                filter: config.blur > 0 ? `blur(${config.blur}px)` : 'none',
                opacity: config.opacity / 100
              }}
            />
            
            <div className="relative p-12 h-full flex flex-col">
              {/* 상단 헤드라인 */}
              {config.showHeadline && (
                <div className="text-center mb-8">
                  <h1 
                    className={`text-5xl mb-4 ${fontStyle.heading}`}
                    style={{ color: config.textColor }}
                  >
                    {config.headline.split('\n').map((line, i) => (
                      <span key={i}>
                        {line}
                        {i < config.headline.split('\n').length - 1 && <br />}
                      </span>
                    ))}
                  </h1>
                  <p 
                    className={`text-xl ${fontStyle.body}`}
                    style={{ color: config.textColor, opacity: 0.8 }}
                  >
                    {config.subheadline}
                  </p>
                </div>
              )}

              {/* 중앙 콘텐츠 */}
              <div className="flex-1 flex items-center justify-center gap-12">
                {/* 상품 이미지 */}
                {config.showProductImage && (
                  <div className="relative">
                    {config.productImage ? (
                      <img 
                        src={config.productImage} 
                        alt="Product"
                        className="w-80 h-80 object-cover rounded-2xl shadow-2xl"
                      />
                    ) : (
                      <div 
                        className="w-80 h-80 rounded-2xl shadow-2xl flex items-center justify-center"
                        style={{ backgroundColor: config.primaryColor + '20' }}
                      >
                        <Sparkles className="w-20 h-20" style={{ color: config.primaryColor }} />
                      </div>
                    )}
                    {config.showDecorations && (
                      <div 
                        className="absolute -top-4 -right-4 w-24 h-24 rounded-full flex items-center justify-center shadow-lg"
                        style={{ backgroundColor: config.accentColor }}
                      >
                        <span className="text-white font-bold text-lg">NEW</span>
                      </div>
                    )}
                  </div>
                )}

                {/* 혜택 리스트 */}
                {config.showBenefits && (
                  <div className="space-y-6">
                    {[config.mainBenefit1, config.mainBenefit2, config.mainBenefit3].map((benefit, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: config.primaryColor + '20' }}
                        >
                          <Check className="w-5 h-5" style={{ color: config.primaryColor }} />
                        </div>
                        <p className={`text-lg ${fontStyle.body}`} style={{ color: config.textColor }}>
                          {benefit}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 하단 섹션 */}
              <div className="mt-8 space-y-4">
                {/* 고객 후기 */}
                {config.showTestimonial && (
                  <div className="text-center p-6 rounded-xl" style={{ backgroundColor: config.bgColor }}>
                    <p className={`text-lg italic ${fontStyle.body}`} style={{ color: config.textColor }}>
                      {config.testimonial}
                    </p>
                    <div className="flex justify-center mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-current" style={{ color: config.accentColor }} />
                      ))}
                    </div>
                  </div>
                )}

                {/* 긴급성 & 보장 */}
                <div className="flex justify-between items-center">
                  {config.showUrgency && (
                    <p className={`text-lg ${fontStyle.body}`} style={{ color: config.accentColor }}>
                      {config.urgencyText}
                    </p>
                  )}
                  {config.showGuarantee && (
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5" style={{ color: config.primaryColor }} />
                      <span className={fontStyle.body} style={{ color: config.textColor }}>
                        {config.guarantee}
                      </span>
                    </div>
                  )}
                </div>

                {/* CTA 버튼 */}
                {config.showCTA && (
                  <button 
                    className={`w-full py-4 rounded-xl text-white text-xl ${fontStyle.heading} shadow-xl transform hover:scale-105 transition-all`}
                    style={{ backgroundColor: config.primaryColor }}
                  >
                    {config.ctaText}
                  </button>
                )}
              </div>
            </div>
          </>
        )
      
      case 'split':
        return (
          <>
            <div 
              className="absolute inset-0"
              style={{
                ...getBackgroundStyle(),
                filter: config.blur > 0 ? `blur(${config.blur}px)` : 'none',
                opacity: config.opacity / 100
              }}
            />
            
            <div className="relative h-full flex">
              {/* 왼쪽: 이미지 */}
              <div className="w-1/2 p-8 flex items-center justify-center">
                {config.showProductImage && (
                  config.productImage ? (
                    <img 
                      src={config.productImage} 
                      alt="Product"
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  ) : (
                    <div 
                      className="w-full h-full rounded-2xl flex items-center justify-center"
                      style={{ backgroundColor: config.primaryColor + '20' }}
                    >
                      <Sparkles className="w-32 h-32" style={{ color: config.primaryColor }} />
                    </div>
                  )
                )}
              </div>

              {/* 오른쪽: 텍스트 */}
              <div className="w-1/2 p-12 flex flex-col justify-center">
                {config.showHeadline && (
                  <div className="mb-8">
                    <h1 
                      className={`text-4xl mb-4 ${fontStyle.heading}`}
                      style={{ color: config.textColor }}
                    >
                      {config.headline.split('\n').map((line, i) => (
                        <span key={i}>
                          {line}
                          {i < config.headline.split('\n').length - 1 && <br />}
                        </span>
                      ))}
                    </h1>
                    <p 
                      className={`text-lg ${fontStyle.body}`}
                      style={{ color: config.textColor, opacity: 0.8 }}
                    >
                      {config.subheadline}
                    </p>
                  </div>
                )}

                {config.showBenefits && (
                  <div className="space-y-4 mb-8">
                    {[config.mainBenefit1, config.mainBenefit2, config.mainBenefit3].map((benefit, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <ArrowRight className="w-5 h-5 mt-1" style={{ color: config.primaryColor }} />
                        <p className={fontStyle.body} style={{ color: config.textColor }}>
                          {benefit}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {config.showTestimonial && (
                  <div className="mb-6 p-4 border-l-4" style={{ borderColor: config.primaryColor }}>
                    <p className={`italic ${fontStyle.body}`} style={{ color: config.textColor }}>
                      {config.testimonial}
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  {config.showUrgency && (
                    <p className={fontStyle.body} style={{ color: config.accentColor }}>
                      {config.urgencyText}
                    </p>
                  )}

                  {config.showCTA && (
                    <button 
                      className={`w-full py-3 rounded-lg text-white ${fontStyle.heading} shadow-lg`}
                      style={{ backgroundColor: config.primaryColor }}
                    >
                      {config.ctaText}
                    </button>
                  )}

                  {config.showGuarantee && (
                    <p className={`text-center text-sm ${fontStyle.body}`} style={{ color: config.textColor, opacity: 0.7 }}>
                      {config.guarantee}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </>
        )

      case 'minimal':
        return (
          <>
            <div 
              className="absolute inset-0"
              style={{
                ...getBackgroundStyle(),
                filter: config.blur > 0 ? `blur(${config.blur}px)` : 'none',
                opacity: config.opacity / 100
              }}
            />
            
            <div className="relative p-16 h-full flex flex-col justify-center items-center">
              {config.showProductImage && (
                <div className="mb-12">
                  {config.productImage ? (
                    <img 
                      src={config.productImage} 
                      alt="Product"
                      className="w-64 h-64 object-cover"
                    />
                  ) : (
                    <div 
                      className="w-64 h-64 flex items-center justify-center"
                      style={{ backgroundColor: config.primaryColor + '10' }}
                    >
                      <Sparkles className="w-16 h-16" style={{ color: config.primaryColor }} />
                    </div>
                  )}
                </div>
              )}

              {config.showHeadline && (
                <div className="text-center mb-12 max-w-2xl">
                  <h1 
                    className={`text-3xl mb-4 ${fontStyle.heading}`}
                    style={{ color: config.textColor }}
                  >
                    {config.headline}
                  </h1>
                  <p 
                    className={fontStyle.body}
                    style={{ color: config.textColor, opacity: 0.7 }}
                  >
                    {config.subheadline}
                  </p>
                </div>
              )}

              {config.showBenefits && (
                <div className="flex gap-8 mb-12">
                  {[config.mainBenefit1, config.mainBenefit2, config.mainBenefit3].map((benefit, i) => (
                    <div key={i} className="text-center">
                      <p className={`text-sm ${fontStyle.body}`} style={{ color: config.textColor }}>
                        {benefit}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {config.showCTA && (
                <button 
                  className={`px-12 py-3 border-2 ${fontStyle.heading} transition-all hover:scale-105`}
                  style={{ 
                    borderColor: config.primaryColor,
                    color: config.primaryColor
                  }}
                >
                  {config.ctaText}
                </button>
              )}
            </div>
          </>
        )

      default:
        return renderContent()
    }
  }

  return (
    <div className="flex h-full">
      <div className={`flex flex-col flex-1 transition-all duration-300 ${isAIExpanded ? 'mr-96' : 'mr-0'}`}>
        {/* 툴바 */}
        <div className="flex-none bg-white border-b-2 border-gray-200 shadow-md">
          <Toolbar className="border-b-0">
            {/* 레이아웃 선택 */}
            <ToolbarSection>
              <ToolbarSelect
                value={config.layoutStyle}
                onChange={(value) => updateConfig('layoutStyle', value as LayoutStyle)}
                options={Object.entries(layoutStyles).map(([key, val]) => ({
                  value: key,
                  label: val.name
                }))}
                label="레이아웃"
              />
              <ToolbarSelect
                value={config.fontStyle}
                onChange={(value) => updateConfig('fontStyle', value as any)}
                options={[
                  { value: 'modern', label: '모던' },
                  { value: 'elegant', label: '우아한' },
                  { value: 'playful', label: '경쾌한' },
                  { value: 'bold', label: '강렬한' }
                ]}
                label="폰트"
              />
            </ToolbarSection>

            {/* 색상 설정 */}
            <ToolbarSection>
              <ToolbarColorPicker
                value={config.primaryColor}
                onChange={(value) => updateConfig('primaryColor', value)}
                label="주색상"
              />
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

            {/* 효과 */}
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

            {/* 액션 버튼 */}
            <ToolbarSection className="border-r-0">
              <ToolbarButton
                onClick={() => fileInputRef.current?.click()}
                tooltip="상품 이미지 업로드"
              >
                <Upload className="w-4 h-4" />
                이미지
              </ToolbarButton>
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

          {/* 두 번째 줄 - 표시 요소 */}
          <Toolbar className="border-t border-gray-100">
            <ToolbarSection>
              <span className="text-sm text-gray-600 font-medium">표시:</span>
              <ToolbarToggle
                checked={config.showHeadline}
                onChange={(checked) => updateConfig('showHeadline', checked)}
                label="헤드라인"
              />
              <ToolbarToggle
                checked={config.showBenefits}
                onChange={(checked) => updateConfig('showBenefits', checked)}
                label="혜택"
              />
              <ToolbarToggle
                checked={config.showTestimonial}
                onChange={(checked) => updateConfig('showTestimonial', checked)}
                label="후기"
              />
              <ToolbarToggle
                checked={config.showGuarantee}
                onChange={(checked) => updateConfig('showGuarantee', checked)}
                label="보장"
              />
              <ToolbarToggle
                checked={config.showUrgency}
                onChange={(checked) => updateConfig('showUrgency', checked)}
                label="긴급"
              />
              <ToolbarToggle
                checked={config.showCTA}
                onChange={(checked) => updateConfig('showCTA', checked)}
                label="CTA"
              />
              <ToolbarToggle
                checked={config.showProductImage}
                onChange={(checked) => updateConfig('showProductImage', checked)}
                label="이미지"
              />
            </ToolbarSection>

            <ToolbarSection>
              <ToolbarButton
                active={showCode}
                onClick={() => setShowCode(!showCode)}
                tooltip="코드 보기"
              >
                {showCode ? <Eye className="w-4 h-4" /> : <Code className="w-4 h-4" />}
                <span className="ml-1">코드</span>
              </ToolbarButton>
            </ToolbarSection>
          </Toolbar>

          {/* 세 번째 줄 - 텍스트 편집 */}
          <Toolbar className="border-t bg-gray-50">
            <ToolbarSection>
              <input
                type="text"
                value={config.headline}
                onChange={(e) => updateConfig('headline', e.target.value)}
                className="px-2 py-1 border rounded text-sm w-48"
                placeholder="헤드라인"
              />
              <input
                type="text"
                value={config.subheadline}
                onChange={(e) => updateConfig('subheadline', e.target.value)}
                className="px-2 py-1 border rounded text-sm w-48"
                placeholder="서브 헤드라인"
              />
              <input
                type="text"
                value={config.ctaText}
                onChange={(e) => updateConfig('ctaText', e.target.value)}
                className="px-2 py-1 border rounded text-sm w-48"
                placeholder="CTA 텍스트"
              />
            </ToolbarSection>
          </Toolbar>
        </div>

        {/* 메인 컨텐츠 */}
        <div className="flex-1 flex items-center justify-center p-8 bg-gray-50 overflow-auto">
          {!showCode ? (
            <div className={`w-full ${
              config.aspectRatio === 'mobile' ? 'max-w-md' : 
              config.aspectRatio === 'square' ? 'max-w-3xl' : 
              'max-w-5xl'
            }`}>
              <Card 
                ref={cardRef}
                className={`relative overflow-hidden shadow-2xl ${
                  config.aspectRatio === 'mobile' ? 'aspect-[9/16]' :
                  config.aspectRatio === 'square' ? 'aspect-square' :
                  'aspect-[4/3]'
                }`}
              >
                {renderContent()}
              </Card>
            </div>
          ) : (
            <div className="w-full max-w-4xl">
              <Card className="p-6 bg-gray-900 text-white">
                <pre className="overflow-x-auto">
                  <code>{JSON.stringify(config, null, 2)}</code>
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
        onApplyChanges={(newConfig) => setConfig(newConfig as unknown as ProductDetailConfig)}
        templateType="상품 상세"
        isExpanded={isAIExpanded}
        onToggleExpanded={setIsAIExpanded}
      />
    </div>
  )
}
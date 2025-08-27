"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Download, Upload, Sparkles, Star, Check, 
  Shield, ChevronRight, TrendingUp, Award, Package
} from "lucide-react"
import { 
  Toolbar, 
  ToolbarSection, 
  ToolbarButton,
  ToolbarColorPicker,
  ToolbarSelect,
} from "@/components/ui/toolbar"
import { toPng } from "html-to-image"
import { useRef, useState, useEffect } from "react"
import AIAssistant from "@/components/ai-assistant"
import Watermark from "@/components/watermark"

type DeviceMode = 'mobile' | 'desktop'
type MobileLayout = 'hero' | 'cards' | 'story'
type DesktopLayout = 'hero' | 'split' | 'minimal'

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
  detailText1: string
  detailText2: string
  
  // 표시 요소
  showHeadline: boolean
  showBenefits: boolean
  showTestimonial: boolean
  showGuarantee: boolean
  showUrgency: boolean
  showCTA: boolean
  showProductImage: boolean
  showDetails: boolean
  showWatermark: boolean
  watermarkText: string
  
  // 스타일
  deviceMode: DeviceMode
  mobileLayout: MobileLayout
  desktopLayout: DesktopLayout
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
  detailText1: "피부 전문가가 인정한 효과",
  detailText2: "누적 판매 100만개 돌파",
  
  showHeadline: true,
  showBenefits: true,
  showTestimonial: true,
  showGuarantee: true,
  showUrgency: true,
  showCTA: true,
  showProductImage: true,
  showDetails: true,
  showWatermark: true,
  watermarkText: 'service-image.vercel.app',
  
  deviceMode: 'mobile',
  mobileLayout: 'hero',
  desktopLayout: 'hero',
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

export default function ProductDetailTemplateV2() {
  const cardRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [config, setConfig] = useState<ProductDetailConfig>(defaultConfig)
  const [isAIExpanded, setIsAIExpanded] = useState(false)

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

  const updateConfig = (key: keyof ProductDetailConfig, value: string | boolean | number | DeviceMode | MobileLayout | DesktopLayout | 'solid' | 'gradient' | 'pattern' | 'modern' | 'elegant' | 'playful' | 'bold' | null) => {
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

  // 모바일 레이아웃 렌더링 함수들
  const renderMobileHero = (fontStyle: { heading: string; body: string }) => (
    <>
      <div 
        className="absolute inset-0"
        style={{
          ...getBackgroundStyle(),
          filter: config.blur > 0 ? `blur(${config.blur}px)` : 'none',
          opacity: config.opacity / 100
        }}
      />
      
      <div className="relative h-full overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* 상품 이미지 */}
          {config.showProductImage && (
            <div className="relative">
              {config.productImage ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img 
                  src={config.productImage} 
                  alt="Product"
                  className="w-full rounded-2xl shadow-lg"
                />
              ) : (
                <div 
                  className="w-full h-64 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: config.primaryColor + '20' }}
                >
                  <Sparkles className="w-16 h-16" style={{ color: config.primaryColor }} />
                </div>
              )}
            </div>
          )}

          {/* 헤드라인 */}
          {config.showHeadline && (
            <div className="text-center">
              <h1 
                className={`text-3xl mb-3 ${fontStyle.heading}`}
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

          {/* 혜택 리스트 */}
          {config.showBenefits && (
            <div className="bg-white/90 rounded-2xl p-6 space-y-4 shadow-lg">
              {[config.mainBenefit1, config.mainBenefit2, config.mainBenefit3].map((benefit, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: config.primaryColor }}
                  >
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <p className={`text-base ${fontStyle.body} leading-relaxed`} style={{ color: config.textColor }}>
                    {benefit}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* 추가 상세 정보 */}
          {config.showDetails && (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/80 rounded-xl p-4 text-center">
                <Award className="w-8 h-8 mx-auto mb-2" style={{ color: config.primaryColor }} />
                <p className={`text-sm ${fontStyle.body}`} style={{ color: config.textColor }}>
                  {config.detailText1}
                </p>
              </div>
              <div className="bg-white/80 rounded-xl p-4 text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-2" style={{ color: config.primaryColor }} />
                <p className={`text-sm ${fontStyle.body}`} style={{ color: config.textColor }}>
                  {config.detailText2}
                </p>
              </div>
            </div>
          )}

          {/* 고객 후기 */}
          {config.showTestimonial && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6">
              <div className="flex justify-center mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" style={{ color: config.accentColor }} />
                ))}
              </div>
              <p className={`text-center text-base italic ${fontStyle.body}`} style={{ color: config.textColor }}>
                {config.testimonial}
              </p>
            </div>
          )}

          {/* 긴급성 */}
          {config.showUrgency && (
            <div className="text-center p-4 bg-red-50 rounded-xl">
              <p className={`text-base font-bold ${fontStyle.body}`} style={{ color: config.accentColor }}>
                {config.urgencyText}
              </p>
            </div>
          )}

          {/* CTA 버튼 (고정) */}
          {config.showCTA && (
            <div className="sticky bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-sm rounded-t-2xl shadow-lg">
              <button 
                className={`w-full py-4 rounded-xl text-white text-lg ${fontStyle.heading} shadow-xl`}
                style={{ backgroundColor: config.primaryColor }}
              >
                {config.ctaText}
              </button>
              {config.showGuarantee && (
                <p className={`text-center text-xs mt-2 ${fontStyle.body}`} style={{ color: config.textColor, opacity: 0.7 }}>
                  🔒 {config.guarantee}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )

  const renderMobileCards = (fontStyle: { heading: string; body: string }) => (
    <>
      <div 
        className="absolute inset-0"
        style={{
          ...getBackgroundStyle(),
          filter: config.blur > 0 ? `blur(${config.blur}px)` : 'none',
          opacity: config.opacity / 100
        }}
      />
      
      <div className="relative h-full overflow-y-auto p-4">
        <div className="space-y-4">
          {/* 헤더 카드 */}
          {config.showHeadline && (
            <Card className="p-6 text-center">
              <h1 className={`text-2xl mb-2 ${fontStyle.heading}`} style={{ color: config.textColor }}>
                {config.headline}
              </h1>
              <p className={`text-base ${fontStyle.body}`} style={{ color: config.textColor, opacity: 0.8 }}>
                {config.subheadline}
              </p>
            </Card>
          )}

          {/* 상품 이미지 카드 */}
          {config.showProductImage && (
            <Card className="p-4">
              {config.productImage ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={config.productImage} alt="Product" className="w-full rounded-lg" />
              ) : (
                <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Package className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </Card>
          )}

          {/* 혜택 카드들 */}
          {config.showBenefits && [config.mainBenefit1, config.mainBenefit2, config.mainBenefit3].map((benefit, i) => (
            <Card key={i} className="p-4 flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: config.primaryColor + '20' }}
              >
                <Check className="w-5 h-5" style={{ color: config.primaryColor }} />
              </div>
              <p className={`${fontStyle.body}`} style={{ color: config.textColor }}>
                {benefit}
              </p>
            </Card>
          ))}

          {/* 후기 카드 */}
          {config.showTestimonial && (
            <Card className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50">
              <div className="flex justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" style={{ color: config.accentColor }} />
                ))}
              </div>
              <p className={`text-center italic ${fontStyle.body}`} style={{ color: config.textColor }}>
                {config.testimonial}
              </p>
            </Card>
          )}

          {/* CTA 카드 */}
          {config.showCTA && (
            <Card className="p-6 sticky bottom-4">
              <button 
                className={`w-full py-3 rounded-lg text-white ${fontStyle.heading}`}
                style={{ backgroundColor: config.primaryColor }}
              >
                {config.ctaText}
              </button>
            </Card>
          )}
        </div>
      </div>
    </>
  )

  // 데스크탑 레이아웃 렌더링 함수들
  const renderDesktopHero = (fontStyle: { heading: string; body: string }) => (
    <>
      <div 
        className="absolute inset-0"
        style={{
          ...getBackgroundStyle(),
          filter: config.blur > 0 ? `blur(${config.blur}px)` : 'none',
          opacity: config.opacity / 100
        }}
      />
      
      <div className="relative p-12 h-full flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-2 gap-12 items-center">
            {/* 왼쪽: 텍스트 콘텐츠 */}
            <div className="space-y-6">
              {config.showHeadline && (
                <div>
                  <h1 className={`text-5xl mb-4 ${fontStyle.heading}`} style={{ color: config.textColor }}>
                    {config.headline}
                  </h1>
                  <p className={`text-xl ${fontStyle.body}`} style={{ color: config.textColor, opacity: 0.8 }}>
                    {config.subheadline}
                  </p>
                </div>
              )}

              {config.showBenefits && (
                <div className="space-y-4">
                  {[config.mainBenefit1, config.mainBenefit2, config.mainBenefit3].map((benefit, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <ChevronRight className="w-6 h-6" style={{ color: config.primaryColor }} />
                      <p className={`text-lg ${fontStyle.body}`} style={{ color: config.textColor }}>
                        {benefit}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {config.showTestimonial && (
                <div className="border-l-4 pl-4" style={{ borderColor: config.primaryColor }}>
                  <p className={`italic text-lg ${fontStyle.body}`} style={{ color: config.textColor }}>
                    {config.testimonial}
                  </p>
                </div>
              )}

              <div className="flex gap-4 items-center">
                {config.showCTA && (
                  <button 
                    className={`px-8 py-4 rounded-xl text-white text-lg ${fontStyle.heading} shadow-xl`}
                    style={{ backgroundColor: config.primaryColor }}
                  >
                    {config.ctaText}
                  </button>
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
            </div>

            {/* 오른쪽: 이미지 */}
            {config.showProductImage && (
              <div className="relative">
                {config.productImage ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img 
                    src={config.productImage} 
                    alt="Product"
                    className="w-full rounded-2xl shadow-2xl"
                  />
                ) : (
                  <div 
                    className="w-full h-96 rounded-2xl shadow-2xl flex items-center justify-center"
                    style={{ backgroundColor: config.primaryColor + '20' }}
                  >
                    <Sparkles className="w-24 h-24" style={{ color: config.primaryColor }} />
                  </div>
                )}
                {config.showUrgency && (
                  <div 
                    className="absolute -top-4 -right-4 px-6 py-3 rounded-full shadow-lg"
                    style={{ backgroundColor: config.accentColor }}
                  >
                    <p className="text-white font-bold">LIMITED</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )

  const renderContent = () => {
    const fontStyle = fontStyles[config.fontStyle]
    
    if (config.deviceMode === 'mobile') {
      switch(config.mobileLayout) {
        case 'hero':
          return renderMobileHero(fontStyle)
        case 'cards':
          return renderMobileCards(fontStyle)
        default:
          return renderMobileHero(fontStyle)
      }
    } else {
      // 데스크탑 레이아웃
      switch(config.desktopLayout) {
        case 'hero':
          return renderDesktopHero(fontStyle)
        default:
          return renderDesktopHero(fontStyle)
      }
    }
  }

  return (
    <div className="flex h-full">
      <div className={`flex flex-col flex-1 transition-all duration-300 ${isAIExpanded ? 'mr-96' : 'mr-0'}`}>
        {/* 툴바 */}
        <div className="flex-none bg-white border-b-2 border-gray-200 shadow-md">
          <Toolbar className="border-b-0">
            {/* 디바이스 모드 및 레이아웃 선택 */}
            <ToolbarSection>
              <ToolbarSelect
                value={config.deviceMode}
                onChange={(value) => updateConfig('deviceMode', value as DeviceMode)}
                options={[
                  { value: 'mobile', label: '📱 모바일' },
                  { value: 'desktop', label: '💻 데스크탑' }
                ]}
                label="디바이스"
              />
              {config.deviceMode === 'mobile' ? (
                <ToolbarSelect
                  value={config.mobileLayout}
                  onChange={(value) => updateConfig('mobileLayout', value as MobileLayout)}
                  options={[
                    { value: 'hero', label: '히어로' },
                    { value: 'cards', label: '카드형' },
                    { value: 'story', label: '스토리' }
                  ]}
                  label="레이아웃"
                />
              ) : (
                <ToolbarSelect
                  value={config.desktopLayout}
                  onChange={(value) => updateConfig('desktopLayout', value as DesktopLayout)}
                  options={[
                    { value: 'hero', label: '히어로' },
                    { value: 'split', label: '분할' },
                    { value: 'minimal', label: '미니멀' }
                  ]}
                  label="레이아웃"
                />
              )}
              <ToolbarSelect
                value={config.fontStyle}
                onChange={(value) => updateConfig('fontStyle', value as 'modern' | 'elegant' | 'playful' | 'bold')}
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

            {/* 표시 옵션 */}
            <ToolbarSection>
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
        </div>

        {/* 메인 컨텐츠 */}
        <div className="flex-1 flex items-center justify-center p-8 bg-gray-50 overflow-auto">
          <div className={`w-full ${
            config.deviceMode === 'mobile' ? 'max-w-md' : 'max-w-7xl'
          }`}>
            <Card 
              ref={cardRef}
              className={`relative overflow-hidden shadow-2xl ${
                config.deviceMode === 'mobile' ? 'aspect-[9/16]' : 'aspect-[16/9]'
              }`}
            >
              {renderContent()}
              {config.showWatermark && (
                <Watermark position="bottom-right" opacity={0.8} size="small" text={config.watermarkText} />
              )}
            </Card>
          </div>
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
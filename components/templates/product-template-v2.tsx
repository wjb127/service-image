"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Download, Star, ShoppingCart, Package, Award, Clock, 
  Truck, Heart, Sparkles, Leaf, ChefHat, Coffee, Upload,
  Code, Eye, MoreVertical
} from "lucide-react"
import { 
  Toolbar, 
  ToolbarSection, 
  ToolbarButton,
  ToolbarColorPicker,
  ToolbarToggle
} from "@/components/ui/toolbar"
import { toPng } from "html-to-image"
import { useRef, useState } from "react"
import AIAssistant from "@/components/ai-assistant"

type ProductCategory = 'beauty' | 'food'

interface ProductConfig {
  category: ProductCategory
  productName: string
  originalPrice: string
  salePrice: string
  discountRate: string
  shippingText: string
  ratingScore: string
  reviewCount: string
  stockStatus: string
  badge: string
  
  // 뷰티 전용
  skinType: string
  ingredients: string
  volume: string
  
  // F&B 전용
  expireDate: string
  origin: string
  calories: string
  
  // 표시 요소
  showPrice: boolean
  showDiscount: boolean
  showShipping: boolean
  showRating: boolean
  showStock: boolean
  showBadge: boolean
  showTimer: boolean
  showIngredients: boolean
  showCertification: boolean
  timerText: string
  
  // 스타일
  bgType: 'solid' | 'gradient' | 'image'
  bgColor: string
  bgGradientStart: string
  bgGradientEnd: string
  textColor: string
  accentColor: string
  fontSize: string
  enableAnimations: boolean  // AI가 제어할 수 있는 애니메이션 플래그
}

const beautyDefaultConfig: ProductConfig = {
  category: 'beauty',
  productName: "비타민C 브라이트닝 세럼",
  originalPrice: "68,000",
  salePrice: "39,900",
  discountRate: "41%",
  shippingText: "오늘 출발 · 무료배송",
  ratingScore: "4.9",
  reviewCount: "8,234",
  stockStatus: "한정수량! 10개 남음",
  badge: "베스트셀러",
  skinType: "모든 피부",
  ingredients: "비타민C 20% · 히알루론산",
  volume: "30ml",
  expireDate: "",
  origin: "",
  calories: "",
  showPrice: true,
  showDiscount: true,
  showShipping: true,
  showRating: true,
  showStock: false,
  showBadge: true,
  showTimer: false,
  showIngredients: true,
  showCertification: true,
  timerText: "타임딜 종료까지 02:34:21",
  bgType: 'gradient',
  bgColor: "#fce7f3",
  bgGradientStart: "#fce7f3",
  bgGradientEnd: "#e9d5ff",
  textColor: "#111827",
  accentColor: "#ec4899",
  fontSize: "text-4xl",
  enableAnimations: true
}

const foodDefaultConfig: ProductConfig = {
  category: 'food',
  productName: "제주 한라봉 선물세트",
  originalPrice: "59,900",
  salePrice: "45,900",
  discountRate: "23%",
  shippingText: "새벽배송 · 무료",
  ratingScore: "4.8",
  reviewCount: "3,456",
  stockStatus: "신선도 100%",
  badge: "프리미엄",
  skinType: "",
  ingredients: "",
  volume: "",
  expireDate: "수확 후 7일",
  origin: "제주도",
  calories: "100g당 47kcal",
  showPrice: true,
  showDiscount: true,
  showShipping: true,
  showRating: true,
  showStock: false,
  showBadge: true,
  showTimer: false,
  showIngredients: true,
  showCertification: true,
  timerText: "오늘의 특가 마감까지 05:23:15",
  bgType: 'gradient',
  bgColor: "#ffedd5",
  bgGradientStart: "#ffedd5",
  bgGradientEnd: "#fef3c7",
  textColor: "#111827",
  accentColor: "#ea580c",
  fontSize: "text-4xl",
  enableAnimations: true
}

export default function ProductTemplateV2() {
  const cardRef = useRef<HTMLDivElement>(null)
  const bgImageInputRef = useRef<HTMLInputElement>(null)
  const productImageInputRef = useRef<HTMLInputElement>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [category, setCategory] = useState<ProductCategory>('beauty')
  const [config, setConfig] = useState<ProductConfig>(beautyDefaultConfig)
  const [customBgImage, setCustomBgImage] = useState<string | null>(null)
  const [productImage, setProductImage] = useState<string | null>(null)
  const [showCode, setShowCode] = useState(false)
  const [showMoreOptions, setShowMoreOptions] = useState(false)
  const [isAIExpanded, setIsAIExpanded] = useState(false)

  const handleCategoryChange = (newCategory: ProductCategory) => {
    setCategory(newCategory)
    setConfig(newCategory === 'beauty' ? beautyDefaultConfig : foodDefaultConfig)
    setCustomBgImage(null)
    setProductImage(null)
  }

  const handleImageUpload = (file: File, type: 'background' | 'product') => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        if (type === 'background') {
          setCustomBgImage(result)
          setConfig({ ...config, bgType: 'image' })
        } else {
          setProductImage(result)
        }
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
      link.download = `${category}-product-${Date.now()}.png`
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error('Failed to generate image:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  const updateConfig = (key: keyof ProductConfig, value: string | boolean | number | string[]) => {
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
    return `<!-- Product Thumbnail HTML/CSS -->
<div class="product-card" style="${JSON.stringify(getBackgroundStyle(), null, 2).replace(/[{}]/g, '').replace(/"/g, '')}">
  ${config.showCertification ? `
  <div class="certifications">
    ${category === 'beauty' ? 
      `<span class="badge vegan">🌿 비건</span>
       <span class="badge mild">저자극</span>` :
      `<span class="badge organic">🌿 유기농</span>
       <span class="badge haccp">🏆 HACCP</span>`
    }
  </div>` : ''}
  
  ${config.showBadge ? `
  <div class="main-badge" style="background: ${config.accentColor};">
    ${config.badge}
  </div>` : ''}
  
  <div class="product-image">
    ${productImage ? '<img src="product.jpg" alt="Product" />' : '<div class="placeholder">🛒</div>'}
  </div>
  
  <div class="product-info">
    <h2 style="color: ${config.textColor}; font-size: ${config.fontSize};">
      ${config.productName}
    </h2>
    
    ${category === 'beauty' && config.showIngredients ? `
    <p>${config.skinType} | ${config.volume}</p>
    <p class="ingredients">✨ ${config.ingredients}</p>` : ''}
    
    ${category === 'food' && config.showIngredients ? `
    <p>${config.origin} | ${config.expireDate}</p>
    <p class="nutrition">🍽️ ${config.calories}</p>` : ''}
    
    ${config.showPrice ? `
    <div class="price">
      ${config.showDiscount ? `
      <span class="discount">${config.discountRate}</span>
      <span class="original">${config.originalPrice}원</span>` : ''}
      <span class="sale">${config.salePrice}원</span>
    </div>` : ''}
    
    ${config.showRating ? `
    <div class="rating">
      ⭐ ${config.ratingScore} (${config.reviewCount})
    </div>` : ''}
    
    ${config.showShipping ? `
    <div class="shipping">🚚 ${config.shippingText}</div>` : ''}
  </div>
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
        {/* 카테고리 섹션 */}
        <ToolbarSection>
          <span className="text-sm text-gray-600">카테고리:</span>
          <ToolbarButton
            active={category === 'beauty'}
            onClick={() => handleCategoryChange('beauty')}
          >
            <Sparkles className="w-4 h-4" />
            뷰티
          </ToolbarButton>
          <ToolbarButton
            active={category === 'food'}
            onClick={() => handleCategoryChange('food')}
          >
            <Coffee className="w-4 h-4" />
            F&B
          </ToolbarButton>
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
            <ToolbarButton onClick={() => bgImageInputRef.current?.click()}>
              <Upload className="w-4 h-4" />
              업로드
            </ToolbarButton>
          )}
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
            label="액센트"
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
          <ToolbarButton onClick={() => productImageInputRef.current?.click()}>
            <Package className="w-4 h-4" />
            상품 이미지
          </ToolbarButton>
          <Button
            onClick={handleDownload}
            disabled={isDownloading}
            className={`${
              category === 'beauty' 
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600' 
                : 'bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600'
            } text-white`}
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
                checked={config.showPrice}
                onChange={(checked) => updateConfig('showPrice', checked)}
                label="가격"
              />
              <ToolbarToggle
                checked={config.showRating}
                onChange={(checked) => updateConfig('showRating', checked)}
                label="평점"
              />
              <ToolbarToggle
                checked={config.showBadge}
                onChange={(checked) => updateConfig('showBadge', checked)}
                label="뱃지"
              />
              <ToolbarToggle
                checked={config.showDiscount}
                onChange={(checked) => updateConfig('showDiscount', checked)}
                label="할인율"
              />
              <ToolbarToggle
                checked={config.showShipping}
                onChange={(checked) => updateConfig('showShipping', checked)}
                label="배송"
              />
              <ToolbarToggle
                checked={config.showStock}
                onChange={(checked) => updateConfig('showStock', checked)}
                label="재고"
              />
              <ToolbarToggle
                checked={config.showIngredients}
                onChange={(checked) => updateConfig('showIngredients', checked)}
                label={category === 'beauty' ? '성분' : '영양'}
              />
              <ToolbarToggle
                checked={config.showCertification}
                onChange={(checked) => updateConfig('showCertification', checked)}
                label="인증"
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
              value={config.productName}
              onChange={(e) => updateConfig('productName', e.target.value)}
              className="px-2 py-1 border rounded text-sm w-48"
              placeholder="상품명"
            />
            <input
              type="text"
              value={config.originalPrice}
              onChange={(e) => updateConfig('originalPrice', e.target.value)}
              className="px-2 py-1 border rounded text-sm w-24"
              placeholder="정가"
            />
            <input
              type="text"
              value={config.salePrice}
              onChange={(e) => updateConfig('salePrice', e.target.value)}
              className="px-2 py-1 border rounded text-sm w-24"
              placeholder="판매가"
            />
            <input
              type="text"
              value={config.discountRate}
              onChange={(e) => updateConfig('discountRate', e.target.value)}
              className="px-2 py-1 border rounded text-sm w-16"
              placeholder="할인율"
            />
            {category === 'beauty' ? (
              <>
                <input
                  type="text"
                  value={config.ingredients}
                  onChange={(e) => updateConfig('ingredients', e.target.value)}
                  className="px-2 py-1 border rounded text-sm w-32"
                  placeholder="핵심 성분"
                />
                <input
                  type="text"
                  value={config.volume}
                  onChange={(e) => updateConfig('volume', e.target.value)}
                  className="px-2 py-1 border rounded text-sm w-20"
                  placeholder="용량"
                />
              </>
            ) : (
              <>
                <input
                  type="text"
                  value={config.origin}
                  onChange={(e) => updateConfig('origin', e.target.value)}
                  className="px-2 py-1 border rounded text-sm w-24"
                  placeholder="원산지"
                />
                <input
                  type="text"
                  value={config.calories}
                  onChange={(e) => updateConfig('calories', e.target.value)}
                  className="px-2 py-1 border rounded text-sm w-32"
                  placeholder="칼로리"
                />
              </>
            )}
          </ToolbarSection>
        </Toolbar>
      )}

      {/* 메인 컨텐츠 영역 */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50 overflow-auto">
        {!showCode ? (
          <div className="w-full max-w-2xl">
            {/* 상품 썸네일 카드 (1:1) */}
            <Card 
              ref={cardRef} 
              className="relative w-full aspect-square overflow-hidden shadow-2xl"
              style={getBackgroundStyle()}
            >
              {/* 커스텀 배경 이미지일 때 오버레이 */}
              {config.bgType === 'image' && customBgImage && (
                <div className="absolute inset-0 bg-white/10" />
              )}

              {/* 카테고리별 특수 뱃지 */}
              {category === 'beauty' && config.showCertification && (
                <div className="absolute top-4 left-4 z-20 flex gap-2">
                  <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Leaf className="w-3 h-3" />
                    비건
                  </div>
                  <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    저자극
                  </div>
                </div>
              )}

              {category === 'food' && config.showCertification && (
                <div className="absolute top-4 left-4 z-20 flex gap-2">
                  <div className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Leaf className="w-3 h-3" />
                    유기농
                  </div>
                  <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    HACCP
                  </div>
                </div>
              )}

              {/* 뱃지 */}
              {config.showBadge && config.badge && (
                <div className="absolute top-4 right-4 z-20">
                  <div className="text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg flex items-center gap-2"
                       style={{ backgroundColor: config.accentColor }}>
                    {category === 'beauty' ? <Heart className="w-4 h-4" /> : <ChefHat className="w-4 h-4" />}
                    {config.badge}
                  </div>
                </div>
              )}

              {/* 타이머 */}
              {config.showTimer && (
                <div className="absolute top-16 right-4 z-20">
                  <div className="bg-black/80 text-white px-3 py-2 rounded-lg flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-bold">{config.timerText}</span>
                  </div>
                </div>
              )}

              {/* 상품 이미지 영역 */}
              <div className="absolute inset-0 flex flex-col">
                <div className="flex-1 flex items-center justify-center p-8">
                  {productImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={productImage} 
                      alt="Product"
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <div className="w-64 h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                      <ShoppingCart className="w-24 h-24 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* 하단 정보 영역 */}
                <div className="bg-white/95 backdrop-blur-sm p-6 space-y-3">
                  {/* 상품명 */}
                  <h2 className={`${config.fontSize} font-bold leading-tight`}
                      style={{
                        color: config.textColor,
                        fontFamily: 'Pretendard, sans-serif'
                      }}>
                    {config.productName}
                  </h2>

                  {/* 카테고리별 특수 정보 */}
                  {category === 'beauty' && config.showIngredients && (
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-600">피부타입: {config.skinType}</span>
                      <span className="text-gray-600">용량: {config.volume}</span>
                    </div>
                  )}

                  {category === 'food' && config.showIngredients && (
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-600">원산지: {config.origin}</span>
                      <span className="text-gray-600">{config.expireDate}</span>
                    </div>
                  )}

                  {/* 핵심 성분/영양 정보 */}
                  {category === 'beauty' && config.showIngredients && config.ingredients && (
                    <div className="bg-pink-50 text-pink-700 px-3 py-2 rounded-lg text-sm font-medium">
                      ✨ {config.ingredients}
                    </div>
                  )}

                  {category === 'food' && config.showIngredients && config.calories && (
                    <div className="bg-orange-50 text-orange-700 px-3 py-2 rounded-lg text-sm font-medium">
                      🍽️ {config.calories}
                    </div>
                  )}

                  {/* 가격 정보 */}
                  {config.showPrice && (
                    <div className="flex items-end gap-3">
                      {config.showDiscount && (
                        <>
                          <span className="text-red-500 font-black text-3xl">
                            {config.discountRate}
                          </span>
                          <span className="text-gray-400 line-through text-xl">
                            {config.originalPrice}원
                          </span>
                        </>
                      )}
                      <span className="font-black text-3xl">
                        {config.salePrice}원
                      </span>
                    </div>
                  )}

                  {/* 평점 */}
                  {config.showRating && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-5 h-5 ${i < Math.floor(parseFloat(config.ratingScore)) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <span className="font-bold">{config.ratingScore}</span>
                      <span className="text-gray-500">({config.reviewCount})</span>
                    </div>
                  )}

                  {/* 배송 정보 */}
                  {config.showShipping && (
                    <div className="flex items-center gap-2 text-green-600">
                      <Truck className="w-5 h-5" />
                      <span className="font-medium">{config.shippingText}</span>
                    </div>
                  )}

                  {/* 재고 상태 */}
                  {config.showStock && config.stockStatus && (
                    <div className={`px-3 py-2 rounded-lg font-bold text-sm ${config.enableAnimations ? 'animate-pulse' : ''}`}
                         style={{ 
                           backgroundColor: category === 'beauty' ? '#fce7f3' : '#ffedd5',
                           color: category === 'beauty' ? '#ec4899' : '#ea580c'
                         }}>
                      {config.stockStatus}
                    </div>
                  )}
                </div>
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
        ref={bgImageInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleImageUpload(file, 'background')
        }}
        className="hidden"
      />
      <input
        ref={productImageInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleImageUpload(file, 'product')
        }}
        className="hidden"
      />
      </div>
      
      {/* AI 어시스턴트 */}
      <AIAssistant 
        currentDesignCode={config as unknown as Record<string, unknown>}
        onApplyChanges={(newConfig) => setConfig(newConfig as unknown as ProductConfig)}
        templateType={category === 'beauty' ? '뷰티 제품' : 'F&B 제품'}
        isExpanded={isAIExpanded}
        onToggleExpanded={setIsAIExpanded}
      />
    </div>
  )
}
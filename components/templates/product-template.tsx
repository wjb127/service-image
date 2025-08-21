"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Settings, Star, ShoppingCart, Package, TrendingDown, Award, Clock, Truck, Heart, Sparkles, Leaf, ChefHat, Coffee } from "lucide-react"
import { toPng } from "html-to-image"
import { useRef, useState } from "react"

type ProductCategory = 'beauty' | 'food'

interface ProductConfig {
  // 공통 설정
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
  bgColor: string
  textColor: string
  accentColor: string
  fontSize: string
  fontFamily: string
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
  bgColor: "bg-gradient-to-br from-pink-50 to-purple-50",
  textColor: "text-gray-900",
  accentColor: "bg-pink-500",
  fontSize: "text-4xl",
  fontFamily: "pretendard"
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
  bgColor: "bg-gradient-to-br from-orange-50 to-yellow-50",
  textColor: "text-gray-900",
  accentColor: "bg-orange-500",
  fontSize: "text-4xl",
  fontFamily: "pretendard"
}

export default function ProductTemplate() {
  const cardRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [category, setCategory] = useState<ProductCategory>('beauty')
  const [config, setConfig] = useState<ProductConfig>(beautyDefaultConfig)
  const [customBgImage, setCustomBgImage] = useState<string | null>(null)
  const [productImage, setProductImage] = useState<string | null>(null)
  const [showControls, setShowControls] = useState(false)

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

  const updateConfig = (key: keyof ProductConfig, value: any) => {
    setConfig({ ...config, [key]: value })
  }

  return (
    <div className="flex min-h-[600px]">
      {/* Main content area */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
        <div className="w-full max-w-2xl space-y-4">
          {/* 카테고리 선택 */}
          <div className="flex justify-center gap-4 mb-4">
            <Button
              onClick={() => handleCategoryChange('beauty')}
              variant={category === 'beauty' ? 'default' : 'outline'}
              className="px-6 py-3"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              뷰티 제품
            </Button>
            <Button
              onClick={() => handleCategoryChange('food')}
              variant={category === 'food' ? 'default' : 'outline'}
              className="px-6 py-3"
            >
              <Coffee className="w-4 h-4 mr-2" />
              F&B 제품
            </Button>
          </div>

          {/* 간단한 컨트롤 버튼들 */}
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {category === 'beauty' ? (
                <>
                  <Button
                    onClick={() => setConfig({...config, 
                      bgColor: 'bg-gradient-to-br from-pink-50 to-purple-50',
                      accentColor: 'bg-pink-500'
                    })}
                    variant="outline"
                    className="px-3 py-2 text-sm"
                  >
                    로맨틱 핑크
                  </Button>
                  <Button
                    onClick={() => setConfig({...config, 
                      bgColor: 'bg-gradient-to-br from-green-50 to-blue-50',
                      accentColor: 'bg-green-500'
                    })}
                    variant="outline"
                    className="px-3 py-2 text-sm"
                  >
                    내추럴 그린
                  </Button>
                  <Button
                    onClick={() => setConfig({...config, 
                      bgColor: 'bg-black',
                      textColor: 'text-white',
                      accentColor: 'bg-gold-500'
                    })}
                    variant="outline"
                    className="px-3 py-2 text-sm"
                  >
                    럭셔리 블랙
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => setConfig({...config, 
                      bgColor: 'bg-gradient-to-br from-orange-50 to-yellow-50',
                      accentColor: 'bg-orange-500'
                    })}
                    variant="outline"
                    className="px-3 py-2 text-sm"
                  >
                    프레시 오렌지
                  </Button>
                  <Button
                    onClick={() => setConfig({...config, 
                      bgColor: 'bg-gradient-to-br from-green-50 to-lime-50',
                      accentColor: 'bg-green-600'
                    })}
                    variant="outline"
                    className="px-3 py-2 text-sm"
                  >
                    오가닉 그린
                  </Button>
                  <Button
                    onClick={() => setConfig({...config, 
                      bgColor: 'bg-gradient-to-br from-amber-50 to-orange-100',
                      accentColor: 'bg-amber-600'
                    })}
                    variant="outline"
                    className="px-3 py-2 text-sm"
                  >
                    베이커리 브라운
                  </Button>
                </>
              )}
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
              if (file) handleImageUpload(file, 'background')
            }}
            className="hidden"
          />

          {/* 상품 썸네일 카드 (1:1) */}
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
                <div className={`${config.accentColor} text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg flex items-center gap-2`}>
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
                <h2 className={`${config.fontSize} font-bold ${config.textColor} leading-tight`}
                    style={{
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
                  <div className={`${category === 'beauty' ? 'bg-pink-50 text-pink-600' : 'bg-orange-50 text-orange-600'} px-3 py-2 rounded-lg font-bold text-sm animate-pulse`}>
                    {config.stockStatus}
                  </div>
                )}
              </div>
            </div>
          </Card>
          
          {/* 다운로드 버튼 */}
          <div className="flex justify-center gap-3">
            <Button
              onClick={() => document.getElementById('product-image-input')?.click()}
              variant="outline"
              className="font-medium px-6 py-2 rounded-lg"
            >
              <Package className="w-4 h-4 mr-2" />
              상품 이미지 업로드
            </Button>
            <input
              id="product-image-input"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleImageUpload(file, 'product')
              }}
              className="hidden"
            />
            <Button
              onClick={handleDownload}
              disabled={isDownloading}
              className={`${
                category === 'beauty' 
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600' 
                  : 'bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600'
              } text-white font-medium px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all`}
            >
              <Download className="w-4 h-4 mr-2" />
              {isDownloading ? '이미지 생성 중...' : `${category === 'beauty' ? '뷰티' : 'F&B'} 썸네일 다운로드`}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Control Panel */}
      {showControls && (
        <Card className="w-80 h-full bg-white/95 backdrop-blur-sm border-l shadow-xl overflow-y-auto">
          <div className="p-4 border-b">
            <h2 className="text-lg font-bold">
              {category === 'beauty' ? '뷰티 제품' : 'F&B 제품'} 썸네일 설정
            </h2>
          </div>

          <div className="p-4 space-y-4">
            {/* 텍스트 설정 */}
            <div className="space-y-3">
              <h3 className="font-medium text-sm">상품 정보</h3>
              
              <div>
                <label className="text-sm text-gray-600 mb-1 block">상품명</label>
                <input
                  type="text"
                  value={config.productName}
                  onChange={(e) => updateConfig('productName', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                />
              </div>

              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-sm text-gray-600 mb-1 block">정가</label>
                  <input
                    type="text"
                    value={config.originalPrice}
                    onChange={(e) => updateConfig('originalPrice', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm text-gray-600 mb-1 block">판매가</label>
                  <input
                    type="text"
                    value={config.salePrice}
                    onChange={(e) => updateConfig('salePrice', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">할인율</label>
                <input
                  type="text"
                  value={config.discountRate}
                  onChange={(e) => updateConfig('discountRate', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                  placeholder="50%"
                />
              </div>

              {/* 카테고리별 특수 필드 */}
              {category === 'beauty' ? (
                <>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">피부 타입</label>
                    <input
                      type="text"
                      value={config.skinType}
                      onChange={(e) => updateConfig('skinType', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md text-sm"
                      placeholder="모든 피부, 지성, 건성 등"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">핵심 성분</label>
                    <input
                      type="text"
                      value={config.ingredients}
                      onChange={(e) => updateConfig('ingredients', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md text-sm"
                      placeholder="비타민C 20% · 히알루론산"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">용량</label>
                    <input
                      type="text"
                      value={config.volume}
                      onChange={(e) => updateConfig('volume', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md text-sm"
                      placeholder="30ml, 50g 등"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">원산지</label>
                    <input
                      type="text"
                      value={config.origin}
                      onChange={(e) => updateConfig('origin', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md text-sm"
                      placeholder="국내산, 제주도 등"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">유통기한/신선도</label>
                    <input
                      type="text"
                      value={config.expireDate}
                      onChange={(e) => updateConfig('expireDate', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md text-sm"
                      placeholder="수확 후 7일, 제조일로부터 1년 등"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">칼로리/영양정보</label>
                    <input
                      type="text"
                      value={config.calories}
                      onChange={(e) => updateConfig('calories', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md text-sm"
                      placeholder="100g당 47kcal"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="text-sm text-gray-600 mb-1 block">배송 정보</label>
                <input
                  type="text"
                  value={config.shippingText}
                  onChange={(e) => updateConfig('shippingText', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                />
              </div>

              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-sm text-gray-600 mb-1 block">평점</label>
                  <input
                    type="text"
                    value={config.ratingScore}
                    onChange={(e) => updateConfig('ratingScore', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm text-gray-600 mb-1 block">리뷰 수</label>
                  <input
                    type="text"
                    value={config.reviewCount}
                    onChange={(e) => updateConfig('reviewCount', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">재고 상태</label>
                <input
                  type="text"
                  value={config.stockStatus}
                  onChange={(e) => updateConfig('stockStatus', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                  placeholder={category === 'beauty' ? '한정수량! 10개 남음' : '신선도 100%'}
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">뱃지 텍스트</label>
                <input
                  type="text"
                  value={config.badge}
                  onChange={(e) => updateConfig('badge', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                  placeholder={category === 'beauty' ? '베스트셀러, 신상품' : '프리미엄, 오늘의특가'}
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">타이머 텍스트</label>
                <input
                  type="text"
                  value={config.timerText}
                  onChange={(e) => updateConfig('timerText', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                  placeholder="타임딜 종료까지 02:34:21"
                />
              </div>
            </div>

            {/* 표시 요소 */}
            <div className="space-y-3">
              <h3 className="font-medium text-sm">표시 요소</h3>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.showPrice}
                  onChange={(e) => updateConfig('showPrice', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">가격 표시</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.showDiscount}
                  onChange={(e) => updateConfig('showDiscount', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">할인율 표시</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.showShipping}
                  onChange={(e) => updateConfig('showShipping', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">배송 정보</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.showRating}
                  onChange={(e) => updateConfig('showRating', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">평점/리뷰</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.showStock}
                  onChange={(e) => updateConfig('showStock', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">재고 상태</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.showBadge}
                  onChange={(e) => updateConfig('showBadge', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">뱃지</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.showTimer}
                  onChange={(e) => updateConfig('showTimer', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">타이머</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.showIngredients}
                  onChange={(e) => updateConfig('showIngredients', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">
                  {category === 'beauty' ? '성분/용량 정보' : '원산지/영양 정보'}
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.showCertification}
                  onChange={(e) => updateConfig('showCertification', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">
                  {category === 'beauty' ? '비건/저자극 인증' : '유기농/HACCP 인증'}
                </span>
              </label>
            </div>

            {/* 리셋 버튼 */}
            <Button 
              onClick={() => setConfig(category === 'beauty' ? beautyDefaultConfig : foodDefaultConfig)}
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
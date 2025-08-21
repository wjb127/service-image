"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Settings, Star, ShoppingCart, Package, TrendingDown, Award, Clock, Truck } from "lucide-react"
import { toPng } from "html-to-image"
import { useRef, useState } from "react"

interface ProductConfig {
  productName: string
  originalPrice: string
  salePrice: string
  discountRate: string
  shippingText: string
  ratingScore: string
  reviewCount: string
  stockStatus: string
  badge: string
  showPrice: boolean
  showDiscount: boolean
  showShipping: boolean
  showRating: boolean
  showStock: boolean
  showBadge: boolean
  showTimer: boolean
  timerText: string
  bgColor: string
  textColor: string
  accentColor: string
  fontSize: string
  fontFamily: string
}

const defaultConfig: ProductConfig = {
  productName: "프리미엄 무선 이어폰",
  originalPrice: "159,000",
  salePrice: "79,900",
  discountRate: "50%",
  shippingText: "오늘 출발 · 무료배송",
  ratingScore: "4.8",
  reviewCount: "2,341",
  stockStatus: "품절임박! 5개 남음",
  badge: "베스트셀러",
  showPrice: true,
  showDiscount: true,
  showShipping: true,
  showRating: false,
  showStock: false,
  showBadge: true,
  showTimer: false,
  timerText: "타임딜 종료까지 02:34:21",
  bgColor: "bg-white",
  textColor: "text-gray-900",
  accentColor: "bg-red-500",
  fontSize: "text-4xl",
  fontFamily: "pretendard"
}

export default function ProductTemplate() {
  const cardRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [config, setConfig] = useState<ProductConfig>(defaultConfig)
  const [customBgImage, setCustomBgImage] = useState<string | null>(null)
  const [productImage, setProductImage] = useState<string | null>(null)
  const [showControls, setShowControls] = useState(false)

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
      link.download = `product-thumbnail-${Date.now()}.png`
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
    <div className="flex h-[calc(100vh-12rem)]">
      {/* Main content area */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
        <div className="w-full max-w-2xl space-y-4">
          {/* 간단한 컨트롤 버튼들 */}
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button
                onClick={() => setConfig({...config, bgColor: 'bg-white', textColor: 'text-gray-900'})}
                variant="outline"
                className="px-3 py-2 text-sm"
              >
                깔끔한 화이트
              </Button>
              <Button
                onClick={() => setConfig({...config, bgColor: 'bg-gradient-to-br from-yellow-50 to-orange-50', textColor: 'text-gray-900'})}
                variant="outline"
                className="px-3 py-2 text-sm"
              >
                따뜻한 톤
              </Button>
              <Button
                onClick={() => setConfig({...config, bgColor: 'bg-black', textColor: 'text-white'})}
                variant="outline"
                className="px-3 py-2 text-sm"
              >
                블랙 프라이데이
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

            {/* 뱃지 */}
            {config.showBadge && config.badge && (
              <div className="absolute top-4 left-4 z-20">
                <div className={`${config.accentColor} text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg flex items-center gap-2`}>
                  <Award className="w-4 h-4" />
                  {config.badge}
                </div>
              </div>
            )}

            {/* 타이머 */}
            {config.showTimer && (
              <div className="absolute top-4 right-4 z-20">
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
                  <div className="bg-red-50 text-red-600 px-3 py-2 rounded-lg font-bold text-sm animate-pulse">
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
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              <Download className="w-4 h-4 mr-2" />
              {isDownloading ? '이미지 생성 중...' : '상품 썸네일 다운로드'}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Control Panel */}
      {showControls && (
        <Card className="w-80 h-full bg-white/95 backdrop-blur-sm border-l shadow-xl overflow-y-auto">
          <div className="p-4 border-b">
            <h2 className="text-lg font-bold">상품 썸네일 설정</h2>
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
                  placeholder="품절임박! 5개 남음"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">뱃지 텍스트</label>
                <input
                  type="text"
                  value={config.badge}
                  onChange={(e) => updateConfig('badge', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                  placeholder="베스트셀러, 신상품, 한정수량"
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
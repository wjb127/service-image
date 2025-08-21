"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Type, Eye, Palette, Sparkles, Monitor, Globe, Layout as LayoutIcon } from "lucide-react"
import { useState } from "react"

interface ControlPanelProps {
  config: {
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
  }
  onConfigChange: (newConfig: any) => void
}

export default function ControlPanel({ config, onConfigChange }: ControlPanelProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(['display', 'text', 'font'])

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  const updateConfig = (key: string, value: any) => {
    onConfigChange({ ...config, [key]: value })
  }

  return (
    <Card className="w-80 h-full bg-white/95 backdrop-blur-sm border-l shadow-xl overflow-y-auto">
      <div className="p-4 border-b">
        <h2 className="text-lg font-bold">컨트롤 패널</h2>
      </div>

      <div className="p-4 space-y-4">
        {/* 표시 요소 섹션 */}
        <div className="border rounded-lg">
          <button
            onClick={() => toggleSection('display')}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span className="font-medium">표시 요소</span>
            </div>
            {expandedSections.includes('display') ? 
              <ChevronUp className="w-4 h-4" /> : 
              <ChevronDown className="w-4 h-4" />
            }
          </button>
          
          {expandedSections.includes('display') && (
            <div className="px-4 pb-4 space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.showBrowserUI}
                  onChange={(e) => updateConfig('showBrowserUI', e.target.checked)}
                  className="w-4 h-4"
                />
                <Globe className="w-4 h-4 text-gray-600" />
                <span className="text-sm">브라우저 UI</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.showHeroIcon}
                  onChange={(e) => updateConfig('showHeroIcon', e.target.checked)}
                  className="w-4 h-4"
                />
                <Monitor className="w-4 h-4 text-gray-600" />
                <span className="text-sm">메인 아이콘</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.showSubtitle}
                  onChange={(e) => updateConfig('showSubtitle', e.target.checked)}
                  className="w-4 h-4"
                />
                <Type className="w-4 h-4 text-gray-600" />
                <span className="text-sm">서브 텍스트</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.showIconCards}
                  onChange={(e) => updateConfig('showIconCards', e.target.checked)}
                  className="w-4 h-4"
                />
                <LayoutIcon className="w-4 h-4 text-gray-600" />
                <span className="text-sm">아이콘 카드</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.showBottomSection}
                  onChange={(e) => updateConfig('showBottomSection', e.target.checked)}
                  className="w-4 h-4"
                />
                <LayoutIcon className="w-4 h-4 text-gray-600" />
                <span className="text-sm">하단 섹션</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.showSparkles}
                  onChange={(e) => updateConfig('showSparkles', e.target.checked)}
                  className="w-4 h-4"
                />
                <Sparkles className="w-4 h-4 text-gray-600" />
                <span className="text-sm">반짝임 효과</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.cropOptimized}
                  onChange={(e) => updateConfig('cropOptimized', e.target.checked)}
                  className="w-4 h-4"
                />
                <Globe className="w-4 h-4 text-gray-600" />
                <span className="text-sm">정사각형 크롭 최적화</span>
              </label>
            </div>
          )}
        </div>

        {/* 텍스트 편집 섹션 */}
        <div className="border rounded-lg">
          <button
            onClick={() => toggleSection('text')}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4" />
              <span className="font-medium">텍스트 편집</span>
            </div>
            {expandedSections.includes('text') ? 
              <ChevronUp className="w-4 h-4" /> : 
              <ChevronDown className="w-4 h-4" />
            }
          </button>
          
          {expandedSections.includes('text') && (
            <div className="px-4 pb-4 space-y-3">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">메인 타이틀 (상단)</label>
                <input
                  type="text"
                  value={config.mainTitleTop}
                  onChange={(e) => updateConfig('mainTitleTop', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">메인 타이틀 (하단)</label>
                <input
                  type="text"
                  value={config.mainTitleBottom}
                  onChange={(e) => updateConfig('mainTitleBottom', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">서브 텍스트 (상단)</label>
                <input
                  type="text"
                  value={config.subtitleTop}
                  onChange={(e) => updateConfig('subtitleTop', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">서브 텍스트 (하단)</label>
                <input
                  type="text"
                  value={config.subtitleBottom}
                  onChange={(e) => updateConfig('subtitleBottom', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">URL 텍스트</label>
                <input
                  type="text"
                  value={config.urlText}
                  onChange={(e) => updateConfig('urlText', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                />
              </div>
            </div>
          )}
        </div>

        {/* 폰트 설정 섹션 */}
        <div className="border rounded-lg">
          <button
            onClick={() => toggleSection('font')}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              <span className="font-medium">폰트 설정</span>
            </div>
            {expandedSections.includes('font') ? 
              <ChevronUp className="w-4 h-4" /> : 
              <ChevronDown className="w-4 h-4" />
            }
          </button>
          
          {expandedSections.includes('font') && (
            <div className="px-4 pb-4 space-y-3">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">폰트 선택</label>
                <select
                  value={config.fontFamily}
                  onChange={(e) => updateConfig('fontFamily', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                >
                  <option value="pretendard">Pretendard (기본)</option>
                  <option value="suite">SUITE</option>
                  <option value="nanum">나눔고딕</option>
                  <option value="noto">노토산스 KR</option>
                  <option value="gothic">맑은 고딕</option>
                  <option value="gmarket">G마켓 산스</option>
                  <option value="spoqa">스포카 한 산스</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">메인 타이틀 크기</label>
                <select
                  value={config.mainTitleSize}
                  onChange={(e) => updateConfig('mainTitleSize', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                >
                  <option value="text-3xl md:text-4xl">작게 (썸네일용)</option>
                  <option value="text-4xl md:text-5xl">보통</option>
                  <option value="text-5xl md:text-7xl">크게 (기본)</option>
                  <option value="text-6xl md:text-8xl">매우 크게</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">서브 텍스트 크기</label>
                <select
                  value={config.subtitleSize}
                  onChange={(e) => updateConfig('subtitleSize', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                >
                  <option value="text-base md:text-lg">작게 (썸네일용)</option>
                  <option value="text-lg md:text-xl">보통</option>
                  <option value="text-2xl md:text-3xl">크게 (기본)</option>
                  <option value="text-3xl md:text-4xl">매우 크게</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">폰트 굵기</label>
                <select
                  value={config.fontWeight}
                  onChange={(e) => updateConfig('fontWeight', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                >
                  <option value="font-medium">중간 (500)</option>
                  <option value="font-semibold">세미볼드 (600)</option>
                  <option value="font-bold">굵게 (700)</option>
                  <option value="font-extrabold">매우 굵게 (800)</option>
                  <option value="font-black">블랙 (900) - 기본</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* 리셋 버튼 */}
        <Button 
          onClick={() => onConfigChange({
            showBrowserUI: true,
            showHeroIcon: true,
            showSubtitle: true,
            showIconCards: true,
            showBottomSection: true,
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
            cropOptimized: false
          })}
          variant="outline"
          className="w-full"
        >
          기본값으로 리셋
        </Button>
      </div>
    </Card>
  )
}
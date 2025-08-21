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
  }
  onConfigChange: (newConfig: any) => void
}

export default function ControlPanel({ config, onConfigChange }: ControlPanelProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(['display'])

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
            urlText: "your-landing-page.com"
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
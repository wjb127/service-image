"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  ChevronDown, ChevronUp, Type, Eye, Palette, Sparkles, 
  Monitor, Globe, Layout as LayoutIcon, Settings, RotateCcw,
  Upload, Download, Code
} from "lucide-react"
import { useState } from "react"

interface ControlPanelProps {
  config: {
    theme: string
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
  onConfigChange: (newConfig: any) => void
  onThemeChange: (theme: string) => void
  onImageUpload: () => void
  onDownload: () => void
  onShowCode: () => void
  showCode: boolean
}

export default function ControlPanelV2({ 
  config, 
  onConfigChange, 
  onThemeChange,
  onImageUpload,
  onDownload,
  onShowCode,
  showCode
}: ControlPanelProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(['theme', 'display'])

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

  const resetToDefaults = () => {
    onConfigChange({
      ...config,
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
      urlText: "your-landing-page.com"
    })
  }

  return (
    <Card className="w-80 h-full bg-white/95 backdrop-blur-sm border-l shadow-xl overflow-y-auto">
      <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Settings className="w-5 h-5" />
            컨트롤 패널
          </h2>
          <Button
            size="sm"
            variant="ghost"
            onClick={resetToDefaults}
            title="기본값으로 리셋"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* 테마 선택 섹션 */}
        <div className="border rounded-lg">
          <button
            onClick={() => toggleSection('theme')}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              <span className="font-medium">테마 선택</span>
            </div>
            {expandedSections.includes('theme') ? 
              <ChevronUp className="w-4 h-4" /> : 
              <ChevronDown className="w-4 h-4" />
            }
          </button>
          
          {expandedSections.includes('theme') && (
            <div className="px-4 pb-4 space-y-2">
              {['gradient', 'neon', 'glassmorphism', 'minimal', 'retrowave', 'dark'].map((theme) => (
                <button
                  key={theme}
                  onClick={() => onThemeChange(theme)}
                  className={`w-full px-3 py-2 text-left rounded-md transition-colors text-sm capitalize ${
                    config.theme === theme 
                      ? 'bg-blue-100 text-blue-700 font-medium' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {theme === 'neon' && '🌟 '}
                  {theme === 'gradient' && '🎨 '}
                  {theme === 'glassmorphism' && '💎 '}
                  {theme === 'minimal' && '⚪ '}
                  {theme === 'retrowave' && '🌆 '}
                  {theme === 'dark' && '🌙 '}
                  {theme === 'neon' ? '네온' : 
                   theme === 'gradient' ? '그라데이션' :
                   theme === 'glassmorphism' ? '글래스모피즘' :
                   theme === 'minimal' ? '미니멀' :
                   theme === 'retrowave' ? '레트로웨이브' :
                   '다크'}
                </button>
              ))}
              
              <div className="pt-2 border-t">
                <button
                  onClick={onImageUpload}
                  className="w-full px-3 py-2 text-left rounded-md transition-colors text-sm hover:bg-gray-100 flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  배경 이미지 업로드
                </button>
              </div>
            </div>
          )}
        </div>

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
                <span className="text-sm">코드 섹션</span>
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
                <LayoutIcon className="w-4 h-4 text-gray-600" />
                <span className="text-sm">정사각형 크롭</span>
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
                <label className="text-xs text-gray-600 mb-1 block">메인 타이틀 (상단)</label>
                <input
                  type="text"
                  value={config.mainTitleTop}
                  onChange={(e) => updateConfig('mainTitleTop', e.target.value)}
                  className="w-full px-2 py-1 border rounded text-sm"
                />
              </div>
              
              <div>
                <label className="text-xs text-gray-600 mb-1 block">메인 타이틀 (하단)</label>
                <input
                  type="text"
                  value={config.mainTitleBottom}
                  onChange={(e) => updateConfig('mainTitleBottom', e.target.value)}
                  className="w-full px-2 py-1 border rounded text-sm"
                />
              </div>

              <div>
                <label className="text-xs text-gray-600 mb-1 block">서브 텍스트 (상단)</label>
                <input
                  type="text"
                  value={config.subtitleTop}
                  onChange={(e) => updateConfig('subtitleTop', e.target.value)}
                  className="w-full px-2 py-1 border rounded text-sm"
                />
              </div>

              <div>
                <label className="text-xs text-gray-600 mb-1 block">서브 텍스트 (하단)</label>
                <input
                  type="text"
                  value={config.subtitleBottom}
                  onChange={(e) => updateConfig('subtitleBottom', e.target.value)}
                  className="w-full px-2 py-1 border rounded text-sm"
                />
              </div>

              <div>
                <label className="text-xs text-gray-600 mb-1 block">URL 텍스트</label>
                <input
                  type="text"
                  value={config.urlText}
                  onChange={(e) => updateConfig('urlText', e.target.value)}
                  className="w-full px-2 py-1 border rounded text-sm"
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
              <Type className="w-4 h-4" />
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
                <label className="text-xs text-gray-600 mb-1 block">폰트 패밀리</label>
                <select
                  value={config.fontFamily}
                  onChange={(e) => updateConfig('fontFamily', e.target.value)}
                  className="w-full px-2 py-1 border rounded text-sm"
                >
                  <option value="pretendard">Pretendard</option>
                  <option value="suite">SUITE</option>
                  <option value="nanum">나눔고딕</option>
                  <option value="noto">Noto Sans KR</option>
                  <option value="gmarket">Gmarket Sans</option>
                  <option value="spoqa">Spoqa Han Sans</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-600 mb-1 block">타이틀 크기</label>
                <select
                  value={config.mainTitleSize}
                  onChange={(e) => updateConfig('mainTitleSize', e.target.value)}
                  className="w-full px-2 py-1 border rounded text-sm"
                >
                  <option value="text-4xl md:text-6xl">보통</option>
                  <option value="text-5xl md:text-7xl">크게</option>
                  <option value="text-6xl md:text-8xl">매우 크게</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-600 mb-1 block">폰트 굵기</label>
                <select
                  value={config.fontWeight}
                  onChange={(e) => updateConfig('fontWeight', e.target.value)}
                  className="w-full px-2 py-1 border rounded text-sm"
                >
                  <option value="font-bold">굵게</option>
                  <option value="font-extrabold">더 굵게</option>
                  <option value="font-black">매우 굵게</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* 액션 버튼들 */}
        <div className="space-y-2 pt-4 border-t">
          <Button
            onClick={onShowCode}
            variant={showCode ? "secondary" : "outline"}
            className="w-full"
          >
            <Code className="w-4 h-4 mr-2" />
            {showCode ? '디자인 보기' : '코드 보기'}
          </Button>
          
          <Button
            onClick={onDownload}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            이미지 다운로드
          </Button>
        </div>
      </div>
    </Card>
  )
}
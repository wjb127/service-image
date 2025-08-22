"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Download, Plus, Trash2, Type, Upload, Image as ImageIcon,
  Move, Palette, Bold, Italic
} from "lucide-react"
import { 
  Toolbar, 
  ToolbarSection, 
  ToolbarButton,
  ToolbarColorPicker,
  ToolbarSelect,
  ToolbarSlider,
  ToolbarToggle
} from "@/components/ui/toolbar"
import { toPng } from "html-to-image"
import { useRef, useState, useEffect } from "react"
import AIAssistant from "@/components/ai-assistant"

interface TextElement {
  id: string
  text: string
  x: number
  y: number
  fontSize: number
  color: string
  fontFamily: string
  fontWeight: string
  fontStyle: string
  panelIndex: number // 어느 컷에 속하는지 (0-3)
}

interface ComicConfig {
  backgroundImage: string
  texts: TextElement[]
  panelLayout: '2x2' | '1x4' | '4x1'
  borderWidth: number
  borderColor: string
  backgroundColor: string
  blur: number
  opacity: number
}

const defaultBackgroundImage = "/comic-default-bg.png"

const defaultConfig: ComicConfig = {
  backgroundImage: defaultBackgroundImage,
  texts: [],
  panelLayout: '2x2',
  borderWidth: 2,
  borderColor: '#000000',
  backgroundColor: '#ffffff',
  blur: 0,
  opacity: 100
}

export default function ComicTemplate() {
  const cardRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [config, setConfig] = useState<ComicConfig>(defaultConfig)
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isAIExpanded, setIsAIExpanded] = useState(false)

  // 웹 폰트 로드
  useEffect(() => {
    const loadFonts = () => {
      const link = document.createElement('link')
      link.href = 'https://fonts.googleapis.com/css2?family=Nanum+Pen+Script&family=Jua&family=Do+Hyeon&family=Black+Han+Sans&display=swap'
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
        updateConfig('backgroundImage', result)
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
        backgroundColor: config.backgroundColor
      })
      
      const link = document.createElement('a')
      link.download = `comic-${Date.now()}.png`
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error('Failed to generate image:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  const updateConfig = (key: keyof ComicConfig, value: any) => {
    setConfig({ ...config, [key]: value })
  }

  const addText = (panelIndex: number) => {
    const panelWidth = config.panelLayout === '2x2' ? 50 : config.panelLayout === '1x4' ? 100 : 25
    const panelHeight = config.panelLayout === '2x2' ? 50 : config.panelLayout === '4x1' ? 100 : 25
    
    const panelX = config.panelLayout === '2x2' ? (panelIndex % 2) * 50 : 
                   config.panelLayout === '1x4' ? 0 : 
                   panelIndex * 25
    const panelY = config.panelLayout === '2x2' ? Math.floor(panelIndex / 2) * 50 : 
                   config.panelLayout === '1x4' ? panelIndex * 25 : 
                   0

    const newText: TextElement = {
      id: `text-${Date.now()}`,
      text: '텍스트를 입력하세요',
      x: panelX + panelWidth / 2 - 10,
      y: panelY + 10,
      fontSize: 16,
      color: '#000000',
      fontFamily: 'Nanum Pen Script',
      fontWeight: 'normal',
      fontStyle: 'normal',
      panelIndex
    }
    
    updateConfig('texts', [...config.texts, newText])
    setSelectedTextId(newText.id)
  }

  const updateText = (id: string, updates: Partial<TextElement>) => {
    const newTexts = config.texts.map(text => 
      text.id === id ? { ...text, ...updates } : text
    )
    updateConfig('texts', newTexts)
  }

  const deleteText = (id: string) => {
    updateConfig('texts', config.texts.filter(text => text.id !== id))
    setSelectedTextId(null)
  }

  const handleMouseDown = (e: React.MouseEvent, textId: string) => {
    e.preventDefault()
    setSelectedTextId(textId)
    setIsDragging(true)
    
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    
    const text = config.texts.find(t => t.id === textId)
    if (!text) return
    
    setDragOffset({
      x: (e.clientX - rect.left) / rect.width * 100 - text.x,
      y: (e.clientY - rect.top) / rect.height * 100 - text.y
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedTextId) return
    
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    
    const x = (e.clientX - rect.left) / rect.width * 100 - dragOffset.x
    const y = (e.clientY - rect.top) / rect.height * 100 - dragOffset.y
    
    updateText(selectedTextId, { x, y })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const selectedText = config.texts.find(t => t.id === selectedTextId)

  const getFontStyle = (fontFamily: string) => {
    const fontMap: { [key: string]: string } = {
      'nanumpen': 'Nanum Pen Script, cursive',
      'jua': 'Jua, sans-serif',
      'dohyeon': 'Do Hyeon, sans-serif',
      'blackhan': 'Black Han Sans, sans-serif',
      'default': 'Pretendard, sans-serif'
    }
    return fontMap[fontFamily] || fontMap['default']
  }

  return (
    <div className="flex h-full">
      {/* 메인 컨텐츠 영역 */}
      <div className={`flex flex-col flex-1 transition-all duration-300 ${isAIExpanded ? 'mr-96' : 'mr-0'}`}>
        {/* 상단 툴바 */}
        <div className="flex-none bg-white border-b-2 border-gray-200 shadow-md">
          {/* 첫 번째 줄 - 기본 도구 */}
          <Toolbar className="border-b-0">
            <ToolbarSection>
              <ToolbarButton
                onClick={() => fileInputRef.current?.click()}
                tooltip="배경 이미지 업로드"
              >
                <Upload className="w-4 h-4" />
                배경 변경
              </ToolbarButton>
              <ToolbarSelect
                value={config.panelLayout}
                onChange={(value) => updateConfig('panelLayout', value)}
                options={[
                  { value: '2x2', label: '2x2 레이아웃' },
                  { value: '1x4', label: '세로 4컷' },
                  { value: '4x1', label: '가로 4컷' }
                ]}
                label="레이아웃"
              />
            </ToolbarSection>

            <ToolbarSection>
              <ToolbarColorPicker
                value={config.borderColor}
                onChange={(value) => updateConfig('borderColor', value)}
                label="테두리"
              />
              <ToolbarSlider
                label="테두리 굵기"
                value={config.borderWidth}
                onChange={(value) => updateConfig('borderWidth', value)}
                min={0}
                max={10}
                step={1}
                unit="px"
              />
            </ToolbarSection>

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

          {/* 두 번째 줄 - 텍스트 편집 도구 */}
          {selectedText && (
            <Toolbar className="border-t border-gray-100">
              <ToolbarSection>
                <span className="text-sm text-gray-600 font-medium">선택된 텍스트:</span>
                <input
                  type="text"
                  value={selectedText.text}
                  onChange={(e) => updateText(selectedText.id, { text: e.target.value })}
                  className="px-2 py-1 border rounded text-sm w-48"
                  placeholder="텍스트 입력"
                />
                <ToolbarColorPicker
                  value={selectedText.color}
                  onChange={(value) => updateText(selectedText.id, { color: value })}
                  label="색상"
                />
                <ToolbarSlider
                  label="크기"
                  value={selectedText.fontSize}
                  onChange={(value) => updateText(selectedText.id, { fontSize: value })}
                  min={8}
                  max={72}
                  step={2}
                  unit="px"
                />
                <ToolbarSelect
                  value={selectedText.fontFamily}
                  onChange={(value) => updateText(selectedText.id, { fontFamily: value })}
                  options={[
                    { value: 'nanumpen', label: '나눔펜체' },
                    { value: 'jua', label: 'Jua체' },
                    { value: 'dohyeon', label: '도현체' },
                    { value: 'blackhan', label: '검은고딕' },
                    { value: 'default', label: '기본체' }
                  ]}
                  label="폰트"
                />
                <ToolbarToggle
                  checked={selectedText.fontWeight === 'bold'}
                  onChange={(checked) => updateText(selectedText.id, { fontWeight: checked ? 'bold' : 'normal' })}
                  label="굵게"
                />
                <ToolbarToggle
                  checked={selectedText.fontStyle === 'italic'}
                  onChange={(checked) => updateText(selectedText.id, { fontStyle: checked ? 'italic' : 'normal' })}
                  label="기울임"
                />
                <ToolbarButton
                  onClick={() => deleteText(selectedText.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                  삭제
                </ToolbarButton>
              </ToolbarSection>
            </Toolbar>
          )}
        </div>

        {/* 메인 컨텐츠 영역 */}
        <div className="flex-1 flex items-center justify-center p-8 bg-gray-50 overflow-auto">
          <div className="w-full max-w-4xl">
            {/* 4컷 만화 카드 */}
            <Card 
              ref={cardRef}
              className="relative aspect-square overflow-hidden shadow-2xl bg-white"
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{ backgroundColor: config.backgroundColor }}
            >
              {/* 배경 이미지 레이어 */}
              <div 
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(${config.backgroundImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: config.blur > 0 ? `blur(${config.blur}px)` : 'none',
                  opacity: config.opacity / 100
                }}
              />

              {/* 패널 구분선 */}
              <div className="absolute inset-0 pointer-events-none">
                {config.panelLayout === '2x2' && (
                  <>
                    <div 
                      className="absolute top-0 left-1/2 h-full"
                      style={{ 
                        width: `${config.borderWidth}px`,
                        backgroundColor: config.borderColor,
                        transform: 'translateX(-50%)'
                      }}
                    />
                    <div 
                      className="absolute top-1/2 left-0 w-full"
                      style={{ 
                        height: `${config.borderWidth}px`,
                        backgroundColor: config.borderColor,
                        transform: 'translateY(-50%)'
                      }}
                    />
                  </>
                )}
                {config.panelLayout === '1x4' && (
                  <>
                    {[1, 2, 3].map(i => (
                      <div 
                        key={i}
                        className="absolute left-0 w-full"
                        style={{ 
                          top: `${i * 25}%`,
                          height: `${config.borderWidth}px`,
                          backgroundColor: config.borderColor,
                          transform: 'translateY(-50%)'
                        }}
                      />
                    ))}
                  </>
                )}
                {config.panelLayout === '4x1' && (
                  <>
                    {[1, 2, 3].map(i => (
                      <div 
                        key={i}
                        className="absolute top-0 h-full"
                        style={{ 
                          left: `${i * 25}%`,
                          width: `${config.borderWidth}px`,
                          backgroundColor: config.borderColor,
                          transform: 'translateX(-50%)'
                        }}
                      />
                    ))}
                  </>
                )}
              </div>

              {/* 텍스트 요소들 */}
              {config.texts.map(text => (
                <div
                  key={text.id}
                  className={`absolute cursor-move select-none ${
                    selectedTextId === text.id ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                  }`}
                  style={{
                    left: `${text.x}%`,
                    top: `${text.y}%`,
                    fontSize: `${text.fontSize}px`,
                    color: text.color,
                    fontFamily: getFontStyle(text.fontFamily),
                    fontWeight: text.fontWeight,
                    fontStyle: text.fontStyle,
                    textShadow: '1px 1px 2px rgba(255,255,255,0.8), -1px -1px 2px rgba(255,255,255,0.8)',
                    zIndex: selectedTextId === text.id ? 20 : 10
                  }}
                  onMouseDown={(e) => handleMouseDown(e, text.id)}
                  onClick={() => setSelectedTextId(text.id)}
                >
                  {text.text}
                </div>
              ))}

              {/* 각 패널에 텍스트 추가 버튼 */}
              <div className="absolute inset-0 pointer-events-none">
                {[0, 1, 2, 3].map(panelIndex => {
                  const panelX = config.panelLayout === '2x2' ? (panelIndex % 2) * 50 : 
                               config.panelLayout === '1x4' ? 0 : 
                               panelIndex * 25
                  const panelY = config.panelLayout === '2x2' ? Math.floor(panelIndex / 2) * 50 : 
                               config.panelLayout === '1x4' ? panelIndex * 25 : 
                               0
                  const panelWidth = config.panelLayout === '2x2' ? 50 : 
                                    config.panelLayout === '1x4' ? 100 : 
                                    25
                  const panelHeight = config.panelLayout === '2x2' ? 50 : 
                                     config.panelLayout === '4x1' ? 100 : 
                                     25

                  return (
                    <button
                      key={panelIndex}
                      className="absolute pointer-events-auto opacity-0 hover:opacity-100 transition-opacity bg-black/50 text-white rounded-full p-2"
                      style={{
                        left: `${panelX + panelWidth / 2}%`,
                        top: `${panelY + panelHeight / 2}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                      onClick={() => addText(panelIndex)}
                      title={`${panelIndex + 1}번 컷에 텍스트 추가`}
                    >
                      <Plus className="w-6 h-6" />
                    </button>
                  )
                })}
              </div>
            </Card>

            {/* 사용 안내 */}
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-bold text-sm mb-2">사용 방법</h3>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• 각 컷의 + 버튼을 클릭하여 텍스트를 추가하세요</li>
                <li>• 텍스트를 클릭하고 드래그하여 위치를 조정하세요</li>
                <li>• 상단 툴바에서 선택된 텍스트의 스타일을 편집하세요</li>
                <li>• 배경 변경 버튼으로 다른 만화 이미지를 업로드할 수 있습니다</li>
              </ul>
            </div>
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
        onApplyChanges={(newConfig) => setConfig(newConfig as unknown as ComicConfig)}
        templateType="4컷 만화"
        isExpanded={isAIExpanded}
        onToggleExpanded={setIsAIExpanded}
      />
    </div>
  )
}
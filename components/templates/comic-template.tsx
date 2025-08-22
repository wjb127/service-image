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
  width: number
  height: number
  fontSize: number
  color: string
  fontFamily: string
  fontWeight: string
  fontStyle: string
  backgroundColor: string
  borderColor: string
  borderWidth: number
  borderRadius: number
  borderStyle: 'bubble' | 'none' | 'box' // 말풍선, 없음, 상자
  bubbleDirection: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' // 말풍선 꼬리 방향
  padding: number
  textAlign: 'left' | 'center' | 'right'
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
  const [selectedPanel, setSelectedPanel] = useState<number>(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [resizeDirection, setResizeDirection] = useState<'se' | 'sw' | 'ne' | 'nw' | null>(null)
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

  const addText = () => {
    const panelIndex = selectedPanel;
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
      x: panelX + panelWidth / 2 - 15,
      y: panelY + 10,
      width: 30,
      height: 10,
      fontSize: 16,
      color: '#000000',
      fontFamily: 'nanumpen',
      fontWeight: 'normal',
      fontStyle: 'normal',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#000000',
      borderWidth: 2,
      borderRadius: 8,
      borderStyle: 'bubble',
      bubbleDirection: 'bottom-left',
      padding: 8,
      textAlign: 'center',
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
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    
    if (isDragging && selectedTextId) {
      const x = Math.max(0, Math.min(90, (e.clientX - rect.left) / rect.width * 100 - dragOffset.x))
      const y = Math.max(0, Math.min(90, (e.clientY - rect.top) / rect.height * 100 - dragOffset.y))
      updateText(selectedTextId, { x, y })
    } else if (isResizing && selectedTextId) {
      const text = config.texts.find(t => t.id === selectedTextId)
      if (!text) return
      
      const mouseX = (e.clientX - rect.left) / rect.width * 100
      const mouseY = (e.clientY - rect.top) / rect.height * 100
      
      if (resizeDirection === 'se') {
        const width = Math.max(10, mouseX - text.x)
        const height = Math.max(5, mouseY - text.y)
        updateText(selectedTextId, { width, height })
      } else if (resizeDirection === 'sw') {
        const newX = Math.min(text.x + text.width - 10, mouseX)
        const width = Math.max(10, text.x + text.width - newX)
        const height = Math.max(5, mouseY - text.y)
        updateText(selectedTextId, { x: newX, width, height })
      }
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setIsResizing(false)
    setResizeDirection(null)
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

  // 말풍선 SVG 패스 생성
  const getBubblePath = (width: number, height: number, direction: string) => {
    const w = width
    const h = height
    const r = 8 // 모서리 둥글기
    const tailSize = 15 // 꼬리 크기
    
    let path = ''
    
    switch(direction) {
      case 'bottom-left':
        path = `
          M ${r} 0
          L ${w - r} 0
          Q ${w} 0 ${w} ${r}
          L ${w} ${h - r}
          Q ${w} ${h} ${w - r} ${h}
          L ${tailSize + 10} ${h}
          L ${tailSize} ${h + tailSize}
          L ${tailSize + 5} ${h}
          L ${r} ${h}
          Q 0 ${h} 0 ${h - r}
          L 0 ${r}
          Q 0 0 ${r} 0
        `
        break
      case 'bottom-right':
        path = `
          M ${r} 0
          L ${w - r} 0
          Q ${w} 0 ${w} ${r}
          L ${w} ${h - r}
          Q ${w} ${h} ${w - r} ${h}
          L ${w - tailSize - 5} ${h}
          L ${w - tailSize} ${h + tailSize}
          L ${w - tailSize - 10} ${h}
          L ${r} ${h}
          Q 0 ${h} 0 ${h - r}
          L 0 ${r}
          Q 0 0 ${r} 0
        `
        break
      case 'top-left':
        path = `
          M ${tailSize} ${-tailSize}
          L ${tailSize + 5} 0
          L ${w - r} 0
          Q ${w} 0 ${w} ${r}
          L ${w} ${h - r}
          Q ${w} ${h} ${w - r} ${h}
          L ${r} ${h}
          Q 0 ${h} 0 ${h - r}
          L 0 ${r}
          Q 0 0 ${r} 0
          L ${tailSize + 10} 0
        `
        break
      case 'top-right':
        path = `
          M ${w - tailSize} ${-tailSize}
          L ${w - tailSize - 5} 0
          L ${r} 0
          Q 0 0 0 ${r}
          L 0 ${h - r}
          Q 0 ${h} ${r} ${h}
          L ${w - r} ${h}
          Q ${w} ${h} ${w} ${h - r}
          L ${w} ${r}
          Q ${w} 0 ${w - r} 0
          L ${w - tailSize - 10} 0
        `
        break
      default:
        // 기본 둥근 사각형
        path = `
          M ${r} 0
          L ${w - r} 0
          Q ${w} 0 ${w} ${r}
          L ${w} ${h - r}
          Q ${w} ${h} ${w - r} ${h}
          L ${r} ${h}
          Q 0 ${h} 0 ${h - r}
          L 0 ${r}
          Q 0 0 ${r} 0
        `
    }
    
    return path
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
              <span className="text-sm text-gray-600 font-medium">선택 컷:</span>
              <div className="flex gap-1">
                {[0, 1, 2, 3].map(i => (
                  <button
                    key={i}
                    onClick={() => setSelectedPanel(i)}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      selectedPanel === i 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}
                  >
                    {i + 1}컷
                  </button>
                ))}
              </div>
              <ToolbarButton
                onClick={addText}
                className="bg-green-500 hover:bg-green-600 text-white"
                tooltip="선택한 컷에 텍스트 추가"
              >
                <Plus className="w-4 h-4" />
                텍스트 추가
              </ToolbarButton>
            </ToolbarSection>

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
                <span className="text-sm text-gray-600 font-medium">텍스트:</span>
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
                  label="글자"
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
                <ToolbarSelect
                  value={selectedText.textAlign}
                  onChange={(value) => updateText(selectedText.id, { textAlign: value as 'left' | 'center' | 'right' })}
                  options={[
                    { value: 'left', label: '왼쪽' },
                    { value: 'center', label: '가운데' },
                    { value: 'right', label: '오른쪽' }
                  ]}
                  label="정렬"
                />
                <ToolbarToggle
                  checked={selectedText.fontWeight === 'bold'}
                  onChange={(checked) => updateText(selectedText.id, { fontWeight: checked ? 'bold' : 'normal' })}
                  label="굵게"
                />
              </ToolbarSection>

              <ToolbarSection>
                <span className="text-sm text-gray-600 font-medium">박스:</span>
                <ToolbarSelect
                  value={selectedText.borderStyle}
                  onChange={(value) => updateText(selectedText.id, { borderStyle: value as 'bubble' | 'none' | 'box' })}
                  options={[
                    { value: 'bubble', label: '말풍선' },
                    { value: 'box', label: '상자' },
                    { value: 'none', label: '없음' }
                  ]}
                  label="모양"
                />
                {selectedText.borderStyle === 'bubble' && (
                  <ToolbarSelect
                    value={selectedText.bubbleDirection}
                    onChange={(value) => updateText(selectedText.id, { bubbleDirection: value as 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' })}
                    options={[
                      { value: 'bottom-left', label: '↙' },
                      { value: 'bottom-right', label: '↘' },
                      { value: 'top-left', label: '↖' },
                      { value: 'top-right', label: '↗' }
                    ]}
                    label="꼬리"
                  />
                )}
                <ToolbarColorPicker
                  value={selectedText.backgroundColor}
                  onChange={(value) => updateText(selectedText.id, { backgroundColor: value })}
                  label="배경"
                />
                <ToolbarColorPicker
                  value={selectedText.borderColor}
                  onChange={(value) => updateText(selectedText.id, { borderColor: value })}
                  label="테두리"
                />
                <ToolbarSlider
                  label="테두리"
                  value={selectedText.borderWidth}
                  onChange={(value) => updateText(selectedText.id, { borderWidth: value })}
                  min={0}
                  max={5}
                  step={1}
                  unit="px"
                />
                <ToolbarSlider
                  label="모서리"
                  value={selectedText.borderRadius}
                  onChange={(value) => updateText(selectedText.id, { borderRadius: value })}
                  min={0}
                  max={20}
                  step={2}
                  unit="px"
                />
                <ToolbarSlider
                  label="여백"
                  value={selectedText.padding}
                  onChange={(value) => updateText(selectedText.id, { padding: value })}
                  min={0}
                  max={20}
                  step={2}
                  unit="px"
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

              {/* 텍스트 박스 요소들 */}
              {config.texts.map(text => {
                const pixelWidth = cardRef.current ? (cardRef.current.offsetWidth * text.width / 100) : 200
                const pixelHeight = cardRef.current ? (cardRef.current.offsetHeight * text.height / 100) : 100
                
                return (
                  <div
                    key={text.id}
                    className={`absolute cursor-move transition-all`}
                    style={{
                      left: `${text.x}%`,
                      top: `${text.y}%`,
                      width: `${text.width}%`,
                      minHeight: `${text.height}%`,
                      zIndex: selectedTextId === text.id ? 20 : 10
                    }}
                    onMouseDown={(e) => handleMouseDown(e, text.id)}
                    onClick={() => setSelectedTextId(text.id)}
                  >
                    {/* 말풍선 배경 */}
                    {text.borderStyle === 'bubble' && (
                      <svg
                        className="absolute inset-0 w-full h-full"
                        style={{ overflow: 'visible' }}
                        viewBox={`0 0 ${pixelWidth} ${pixelHeight + (text.bubbleDirection.includes('bottom') ? 15 : 0)}`}
                        preserveAspectRatio="none"
                      >
                        <path
                          d={getBubblePath(pixelWidth, pixelHeight, text.bubbleDirection)}
                          fill={text.backgroundColor}
                          stroke={text.borderColor}
                          strokeWidth={text.borderWidth}
                        />
                      </svg>
                    )}
                    
                    {/* 상자 배경 */}
                    {text.borderStyle === 'box' && (
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundColor: text.backgroundColor,
                          border: `${text.borderWidth}px solid ${text.borderColor}`,
                          borderRadius: `${text.borderRadius}px`
                        }}
                      />
                    )}
                    
                    {/* 텍스트 내용 */}
                    <div
                      className="relative"
                      style={{
                        padding: `${text.padding}px`,
                        pointerEvents: 'none'
                      }}
                    >
                      <div
                        style={{
                          fontSize: `${text.fontSize}px`,
                          color: text.color,
                          fontFamily: getFontStyle(text.fontFamily),
                          fontWeight: text.fontWeight,
                          fontStyle: text.fontStyle,
                          textAlign: text.textAlign,
                          wordBreak: 'keep-all',
                          whiteSpace: 'pre-wrap'
                        }}
                      >
                        {text.text}
                      </div>
                    </div>
                  
                    
                    {/* 리사이징 핸들 */}
                    {selectedTextId === text.id && (
                      <>
                        <div
                          className="absolute w-3 h-3 bg-blue-500 rounded-full cursor-se-resize"
                          style={{ bottom: '-6px', right: '-6px' }}
                          onMouseDown={(e) => {
                            e.stopPropagation()
                            setIsResizing(true)
                            setResizeDirection('se')
                          }}
                        />
                        <div
                          className="absolute w-3 h-3 bg-blue-500 rounded-full cursor-sw-resize"
                          style={{ bottom: '-6px', left: '-6px' }}
                          onMouseDown={(e) => {
                            e.stopPropagation()
                            setIsResizing(true)
                            setResizeDirection('sw')
                          }}
                        />
                      </>
                    )}
                    
                    {/* 선택 표시 */}
                    {selectedTextId === text.id && (
                      <div 
                        className="absolute inset-0 ring-2 ring-blue-500 pointer-events-none"
                        style={{
                          borderRadius: text.borderStyle === 'box' ? `${text.borderRadius}px` : '0'
                        }}
                      />
                    )}
                  </div>
                )
              })}

              {/* 선택된 패널 표시 */}
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

                return selectedPanel === panelIndex ? (
                  <div
                    key={panelIndex}
                    className="absolute pointer-events-none border-2 border-blue-500 border-dashed"
                    style={{
                      left: `${panelX}%`,
                      top: `${panelY}%`,
                      width: `${panelWidth}%`,
                      height: `${panelHeight}%`
                    }}
                  />
                ) : null
              })}
            </Card>

            {/* 사용 안내 */}
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-bold text-sm mb-2">사용 방법</h3>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• 상단에서 컷을 선택하고 '텍스트 추가' 버튼을 클릭하세요</li>
                <li>• 텍스트 박스를 클릭하고 드래그하여 위치를 조정하세요</li>
                <li>• 박스 모서리의 파란 점을 드래그하여 크기를 조절하세요</li>
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
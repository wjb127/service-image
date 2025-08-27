"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Eye, Code, Type, X, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline } from "lucide-react"
import { toPng } from "html-to-image"
import { useRef, useState, useEffect, useCallback } from "react"
import AIAssistant from "@/components/ai-assistant"
import Watermark from "@/components/watermark"

interface TextBox {
  id: string
  text: string
  x: number
  y: number
  width: number
  height: number
  fontSize: number
  fontWeight: string
  fontStyle: string
  textDecoration: string
  color: string
  backgroundColor: string
  textAlign: 'left' | 'center' | 'right'
  zIndex: number
  isEditing: boolean
}

export default function AIGeneratedTemplateV2() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [showCode, setShowCode] = useState(false)
  const [isAssistantExpanded, setIsAssistantExpanded] = useState(false)
  const [textBoxes, setTextBoxes] = useState<TextBox[]>([])
  const [selectedBoxId, setSelectedBoxId] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [resizeStart, setResizeStart] = useState({ width: 0, height: 0, x: 0, y: 0 })
  const [showWatermark, setShowWatermark] = useState(true)
  const [watermarkText, setWatermarkText] = useState('service-image.vercel.app')
  const [backgroundStyle, setBackgroundStyle] = useState<React.CSSProperties>({
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  })

  // 새 텍스트박스 추가
  const addTextBox = () => {
    const newBox: TextBox = {
      id: Date.now().toString(),
      text: '새 텍스트를 입력하세요',
      x: 100 + (textBoxes.length * 20),
      y: 100 + (textBoxes.length * 20),
      width: 300,
      height: 60,
      fontSize: 24,
      fontWeight: 'normal',
      fontStyle: 'normal',
      textDecoration: 'none',
      color: '#ffffff',
      backgroundColor: 'rgba(0,0,0,0.3)',
      textAlign: 'center',
      zIndex: textBoxes.length,
      isEditing: false
    }
    setTextBoxes([...textBoxes, newBox])
    setSelectedBoxId(newBox.id)
  }

  // 텍스트박스 선택
  const selectBox = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedBoxId(id)
  }

  // 텍스트박스 드래그 시작
  const handleDragStart = (e: React.MouseEvent, boxId: string) => {
    if (e.target instanceof HTMLElement && e.target.classList.contains('resize-handle')) {
      return
    }
    setIsDragging(true)
    const box = textBoxes.find(b => b.id === boxId)
    if (box) {
      setDragStart({
        x: e.clientX - box.x,
        y: e.clientY - box.y
      })
    }
  }

  // 드래그 중
  const handleDragMove = useCallback((e: MouseEvent) => {
    if (isDragging && selectedBoxId) {
      const newX = e.clientX - dragStart.x
      const newY = e.clientY - dragStart.y
      
      setTextBoxes(boxes => boxes.map(box => 
        box.id === selectedBoxId 
          ? { ...box, x: Math.max(0, newX), y: Math.max(0, newY) }
          : box
      ))
    }
  }, [isDragging, selectedBoxId, dragStart.x, dragStart.y])

  // 드래그 종료
  const handleDragEnd = () => {
    setIsDragging(false)
  }

  // 리사이즈 시작
  const handleResizeStart = (e: React.MouseEvent, boxId: string) => {
    e.stopPropagation()
    setIsResizing(true)
    const box = textBoxes.find(b => b.id === boxId)
    if (box) {
      setResizeStart({
        width: box.width,
        height: box.height,
        x: e.clientX,
        y: e.clientY
      })
    }
  }

  // 리사이즈 중
  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (isResizing && selectedBoxId) {
      const deltaX = e.clientX - resizeStart.x
      const deltaY = e.clientY - resizeStart.y
      
      setTextBoxes(boxes => boxes.map(box => 
        box.id === selectedBoxId 
          ? { 
              ...box, 
              width: Math.max(100, resizeStart.width + deltaX),
              height: Math.max(40, resizeStart.height + deltaY)
            }
          : box
      ))
    }
  }, [isResizing, selectedBoxId, resizeStart])

  // 리사이즈 종료
  const handleResizeEnd = () => {
    setIsResizing(false)
  }

  // 텍스트 편집 시작
  const startEditing = (boxId: string) => {
    setTextBoxes(boxes => boxes.map(box => ({
      ...box,
      isEditing: box.id === boxId
    })))
  }

  // 텍스트 편집 종료
  const stopEditing = () => {
    setTextBoxes(boxes => boxes.map(box => ({
      ...box,
      isEditing: false
    })))
  }

  // 텍스트 변경
  const updateText = (boxId: string, newText: string) => {
    setTextBoxes(boxes => boxes.map(box => 
      box.id === boxId ? { ...box, text: newText } : box
    ))
  }

  // 텍스트박스 스타일 업데이트
  const updateBoxStyle = (boxId: string, property: keyof TextBox, value: string | number | boolean) => {
    setTextBoxes(boxes => boxes.map(box => 
      box.id === boxId ? { ...box, [property]: value } : box
    ))
  }

  // 텍스트박스 삭제
  const deleteBox = (boxId: string) => {
    setTextBoxes(boxes => boxes.filter(box => box.id !== boxId))
    setSelectedBoxId(null)
  }

  // 이미지 다운로드
  const downloadImage = async () => {
    if (!canvasRef.current) return
    
    setIsDownloading(true)
    setSelectedBoxId(null) // 선택 표시 숨기기
    
    try {
      const dataUrl = await toPng(canvasRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: 'white'
      })
      
      const link = document.createElement('a')
      link.download = 'ai-generated-thumbnail.png'
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error('Failed to generate image:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  // HTML 코드 생성
  const generateHTML = () => {
    let html = `<div style="width: 1200px; height: 675px; position: relative; ${Object.entries(backgroundStyle).map(([k, v]) => `${k}: ${v}`).join('; ')}">\n`
    
    textBoxes.forEach(box => {
      html += `  <div style="
    position: absolute;
    left: ${box.x}px;
    top: ${box.y}px;
    width: ${box.width}px;
    height: ${box.height}px;
    font-size: ${box.fontSize}px;
    font-weight: ${box.fontWeight};
    font-style: ${box.fontStyle};
    text-decoration: ${box.textDecoration};
    color: ${box.color};
    background-color: ${box.backgroundColor};
    text-align: ${box.textAlign};
    z-index: ${box.zIndex};
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    box-sizing: border-box;
  ">${box.text}</div>\n`
    })
    
    html += '</div>'
    return html
  }

  // AI 변경사항 처리
  const handleAIChanges = (newConfig: Record<string, unknown>) => {
    if (newConfig.textBoxes && Array.isArray(newConfig.textBoxes)) {
      setTextBoxes(newConfig.textBoxes as TextBox[])
    }
    if (newConfig.backgroundStyle && typeof newConfig.backgroundStyle === 'object') {
      setBackgroundStyle(newConfig.backgroundStyle as React.CSSProperties)
    }
  }

  // 현재 디자인 상태 제공
  const getCurrentDesignCode = () => {
    return {
      type: 'interactive-canvas',
      textBoxes,
      backgroundStyle,
      canvasSize: { width: 1200, height: 675 }
    }
  }

  // 마우스 이벤트 리스너
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleDragMove(e)
      }
      if (isResizing) {
        handleResizeMove(e)
      }
    }

    const handleMouseUp = () => {
      handleDragEnd()
      handleResizeEnd()
    }

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, isResizing, handleDragMove, handleResizeMove])

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold mb-2">인터랙티브 AI 캔버스</h1>
          <p className="text-gray-600">
            PPT처럼 텍스트박스를 추가하고 드래그하여 편집하세요!
          </p>
        </div>

        {/* 툴바 */}
        <div className="mb-6 bg-white rounded-lg shadow p-4">
          <div className="flex gap-4 items-center justify-center flex-wrap">
            <Button onClick={addTextBox} className="gap-2">
              <Type className="w-4 h-4" />
              텍스트박스 추가
            </Button>
            
            {selectedBoxId && (
              <>
                <div className="h-6 w-px bg-gray-300" />
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={textBoxes.find(b => b.id === selectedBoxId)?.fontWeight === 'bold' ? 'default' : 'outline'}
                    onClick={() => {
                      const box = textBoxes.find(b => b.id === selectedBoxId)
                      updateBoxStyle(selectedBoxId, 'fontWeight', box?.fontWeight === 'bold' ? 'normal' : 'bold')
                    }}
                  >
                    <Bold className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={textBoxes.find(b => b.id === selectedBoxId)?.fontStyle === 'italic' ? 'default' : 'outline'}
                    onClick={() => {
                      const box = textBoxes.find(b => b.id === selectedBoxId)
                      updateBoxStyle(selectedBoxId, 'fontStyle', box?.fontStyle === 'italic' ? 'normal' : 'italic')
                    }}
                  >
                    <Italic className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={textBoxes.find(b => b.id === selectedBoxId)?.textDecoration === 'underline' ? 'default' : 'outline'}
                    onClick={() => {
                      const box = textBoxes.find(b => b.id === selectedBoxId)
                      updateBoxStyle(selectedBoxId, 'textDecoration', box?.textDecoration === 'underline' ? 'none' : 'underline')
                    }}
                  >
                    <Underline className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={textBoxes.find(b => b.id === selectedBoxId)?.textAlign === 'left' ? 'default' : 'outline'}
                    onClick={() => updateBoxStyle(selectedBoxId, 'textAlign', 'left')}
                  >
                    <AlignLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={textBoxes.find(b => b.id === selectedBoxId)?.textAlign === 'center' ? 'default' : 'outline'}
                    onClick={() => updateBoxStyle(selectedBoxId, 'textAlign', 'center')}
                  >
                    <AlignCenter className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={textBoxes.find(b => b.id === selectedBoxId)?.textAlign === 'right' ? 'default' : 'outline'}
                    onClick={() => updateBoxStyle(selectedBoxId, 'textAlign', 'right')}
                  >
                    <AlignRight className="w-4 h-4" />
                  </Button>
                </div>

                <input
                  type="color"
                  value={textBoxes.find(b => b.id === selectedBoxId)?.color || '#ffffff'}
                  onChange={(e) => updateBoxStyle(selectedBoxId, 'color', e.target.value)}
                  className="w-10 h-10 border rounded cursor-pointer"
                  title="텍스트 색상"
                />

                <input
                  type="number"
                  value={textBoxes.find(b => b.id === selectedBoxId)?.fontSize || 24}
                  onChange={(e) => updateBoxStyle(selectedBoxId, 'fontSize', parseInt(e.target.value))}
                  className="w-20 px-2 py-1 border rounded"
                  placeholder="크기"
                  min="10"
                  max="200"
                />

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteBox(selectedBoxId)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </>
            )}

            <div className="h-6 w-px bg-gray-300" />
            
            <Button onClick={downloadImage} disabled={isDownloading}>
              <Download className="w-4 h-4 mr-2" />
              {isDownloading ? '생성 중...' : 'PNG 다운로드'}
            </Button>
            
            <Button
              onClick={() => setShowWatermark(!showWatermark)}
              variant={showWatermark ? "default" : "outline"}
            >
              워터마크 {showWatermark ? 'ON' : 'OFF'}
            </Button>
            {showWatermark && (
              <input
                type="text"
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                placeholder="워터마크 텍스트"
                className="px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 w-32"
              />
            )}
            
            <Button
              onClick={() => setShowCode(!showCode)}
              variant="outline"
            >
              {showCode ? <Eye className="w-4 h-4 mr-2" /> : <Code className="w-4 h-4 mr-2" />}
              {showCode ? '캔버스 보기' : 'HTML 보기'}
            </Button>
          </div>
        </div>

        {/* 캔버스 또는 코드 */}
        {!showCode ? (
          <div className="flex justify-center">
            <Card className="overflow-hidden shadow-2xl border-0 inline-block">
              <div 
                ref={canvasRef}
                className="relative cursor-default"
                style={{
                  width: '1200px',
                  height: '675px',
                  ...backgroundStyle
                }}
                onClick={() => setSelectedBoxId(null)}
              >
                {textBoxes.map(box => (
                  <div
                    key={box.id}
                    className={`absolute group transition-all ${
                      selectedBoxId === box.id ? 'ring-2 ring-blue-500' : ''
                    } ${isDragging && selectedBoxId === box.id ? 'cursor-move' : 'cursor-pointer'}`}
                    style={{
                      left: `${box.x}px`,
                      top: `${box.y}px`,
                      width: `${box.width}px`,
                      height: `${box.height}px`,
                      fontSize: `${box.fontSize}px`,
                      fontWeight: box.fontWeight,
                      fontStyle: box.fontStyle,
                      textDecoration: box.textDecoration,
                      color: box.color,
                      backgroundColor: box.backgroundColor,
                      textAlign: box.textAlign,
                      zIndex: box.zIndex,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: box.textAlign === 'left' ? 'flex-start' : box.textAlign === 'right' ? 'flex-end' : 'center',
                      padding: '10px',
                      boxSizing: 'border-box',
                      userSelect: box.isEditing ? 'text' : 'none'
                    }}
                    onClick={(e) => selectBox(box.id, e)}
                    onMouseDown={(e) => handleDragStart(e, box.id)}
                    onDoubleClick={() => startEditing(box.id)}
                  >
                    {box.isEditing ? (
                      <input
                        type="text"
                        value={box.text}
                        onChange={(e) => updateText(box.id, e.target.value)}
                        onBlur={stopEditing}
                        onKeyDown={(e) => e.key === 'Enter' && stopEditing()}
                        className="bg-transparent border-none outline-none w-full text-inherit"
                        style={{ textAlign: box.textAlign }}
                        autoFocus
                      />
                    ) : (
                      <span style={{ width: '100%', textAlign: box.textAlign }}>
                        {box.text}
                      </span>
                    )}
                    
                    {/* 리사이즈 핸들 */}
                    {selectedBoxId === box.id && !box.isEditing && (
                      <div
                        className="resize-handle absolute bottom-1 right-1 w-3 h-3 bg-blue-500 rounded-full cursor-se-resize opacity-0 group-hover:opacity-100"
                        onMouseDown={(e) => handleResizeStart(e, box.id)}
                      />
                    )}
                  </div>
                ))}
                {showWatermark && (
                  <Watermark position="bottom-right" opacity={0.8} size="small" text={watermarkText} />
                )}
              </div>
            </Card>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">생성된 HTML 코드</h3>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto text-sm max-h-96">
                <code>{generateHTML()}</code>
              </pre>
              <div className="mt-4 flex gap-2">
                <Button
                  onClick={() => navigator.clipboard.writeText(generateHTML())}
                  size="sm"
                >
                  클립보드에 복사
                </Button>
                <Button
                  onClick={() => {
                    const blob = new Blob([generateHTML()], { type: 'text/html' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = 'interactive-canvas.html'
                    a.click()
                    URL.revokeObjectURL(url)
                  }}
                  size="sm"
                  variant="outline"
                >
                  HTML 파일 다운로드
                </Button>
              </div>
            </Card>
          </div>
        )}

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            💡 <strong>사용법:</strong><br/>
            • 텍스트박스 추가 버튼으로 새 텍스트 추가<br/>
            • 드래그로 위치 이동, 우측 하단 핸들로 크기 조절<br/>
            • 더블클릭으로 텍스트 편집<br/>
            • AI 어시스턴트로 자동 레이아웃 생성 가능!
          </p>
        </div>
      </div>

      <AIAssistant
        currentDesignCode={getCurrentDesignCode()}
        onApplyChanges={handleAIChanges}
        templateType="인터랙티브 캔버스"
        isExpanded={isAssistantExpanded}
        onToggleExpanded={setIsAssistantExpanded}
      />
    </div>
  )
}
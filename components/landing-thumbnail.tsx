"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Monitor, Code2, Sparkles, Zap, Globe, Layout, Download } from "lucide-react"
import { toPng } from "html-to-image"
import { useRef, useState } from "react"

export default function LandingThumbnail() {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    if (!cardRef.current) return
    
    setIsDownloading(true)
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 0.95,
        pixelRatio: 2,
        backgroundColor: '#000000'
      })
      
      const link = document.createElement('a')
      link.download = 'landing-page-thumbnail.png'
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error('Failed to generate image:', error)
    } finally {
      setIsDownloading(false)
    }
  }
  return (
    <div className="w-full max-w-4xl mx-auto p-8 space-y-4">
      <Card ref={cardRef} className="relative w-full aspect-[16/9] bg-black overflow-hidden" style={{ fontFamily: 'var(--font-pretendard)' }}>
        {/* 네온 그리드 배경 */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-black to-blue-900/20" />
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `linear-gradient(cyan 1px, transparent 1px), linear-gradient(90deg, cyan 1px, transparent 1px)`,
              backgroundSize: '50px 50px',
            }}
          />
        </div>
        
        {/* 네온 글로우 효과 */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-[120px] animate-pulse delay-700" />
        
        <div className="absolute top-0 left-0 w-full p-4">
          <div className="bg-black/60 backdrop-blur-md rounded-t-lg p-2 border border-cyan-500/30 shadow-[0_0_15px_rgba(0,255,255,0.3)]">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(255,0,0,0.7)]" />
                <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(255,255,0,0.7)]" />
                <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(0,255,0,0.7)]" />
              </div>
              <div className="flex-1 bg-black/40 rounded-md h-6 flex items-center px-3 border border-cyan-500/20">
                <Globe className="w-3 h-3 text-cyan-400 mr-2" />
                <span className="text-xs text-cyan-400">your-landing-page.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative z-10 text-center px-8">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Zap className="w-16 h-16 text-cyan-400 drop-shadow-2xl animate-pulse" />
                <Zap className="w-16 h-16 text-cyan-400 absolute inset-0 blur-xl animate-pulse" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl text-white mb-4">
              <span className="font-black tracking-tight text-white" style={{
                textShadow: '0 0 20px rgba(0,255,255,0.8), 0 0 40px rgba(0,255,255,0.5)'
              }}>초고속</span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent font-extrabold tracking-tight" style={{
                filter: 'drop-shadow(0 0 20px rgba(0,255,255,0.5))'
              }}>
                랜딩페이지 제작
              </span>
            </h1>
            
            <p className="text-2xl md:text-3xl text-cyan-300 font-medium mt-6 tracking-wide" style={{
              textShadow: '0 0 10px rgba(0,255,255,0.6)'
            }}>
              오늘 문의, 내일 완성, 먼저 보고 결제!
            </p>
            
            <div className="flex items-center justify-center gap-4 mt-8">
              <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] transition-all">
                <Monitor className="w-8 h-8 text-purple-400" />
              </div>
              <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.4)] hover:shadow-[0_0_25px_rgba(59,130,246,0.6)] transition-all">
                <Code2 className="w-8 h-8 text-blue-400" />
              </div>
              <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3 border border-cyan-500/30 shadow-[0_0_15px_rgba(0,255,255,0.4)] hover:shadow-[0_0_25px_rgba(0,255,255,0.6)] transition-all">
                <Layout className="w-8 h-8 text-cyan-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <div className="bg-black/60 backdrop-blur-md p-4 border-t border-cyan-500/30">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded h-20 border border-purple-500/20" />
              <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded h-20 border border-blue-500/20" />
              <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded h-20 border border-cyan-500/20" />
            </div>
          </div>
        </div>

        <Sparkles className="absolute top-20 right-20 w-8 h-8 text-cyan-400 animate-pulse drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]" />
        <Sparkles className="absolute bottom-32 left-20 w-6 h-6 text-purple-400 animate-pulse delay-150 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
        <Sparkles className="absolute top-32 left-32 w-5 h-5 text-blue-400 animate-pulse delay-300 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
      </Card>
      
      <div className="flex justify-center">
        <Button
          onClick={handleDownload}
          disabled={isDownloading}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium px-6 py-2 rounded-lg shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:shadow-[0_0_30px_rgba(0,255,255,0.5)] transition-all"
        >
          <Download className="w-4 h-4 mr-2" />
          {isDownloading ? '이미지 생성 중...' : '이미지 다운로드'}
        </Button>
      </div>
    </div>
  )
}
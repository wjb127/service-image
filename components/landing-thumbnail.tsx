"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Monitor, Code2, Sparkles, Zap, Globe, Layout, Download } from "lucide-react"
import { toPng } from "html-to-image"
import { useRef, useState } from "react"

type ThemeStyle = 'gradient' | 'neon' | 'glassmorphism'

export default function LandingThumbnail() {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [currentTheme, setCurrentTheme] = useState<ThemeStyle>('neon')

  const handleDownload = async () => {
    if (!cardRef.current) return
    
    setIsDownloading(true)
    try {
      const backgroundColor = currentTheme === 'neon' ? '#000000' : 
                             currentTheme === 'glassmorphism' ? '#1a1a2e' : 
                             '#ffffff'
      
      const dataUrl = await toPng(cardRef.current, {
        quality: 0.95,
        pixelRatio: 2,
        backgroundColor
      })
      
      const link = document.createElement('a')
      link.download = `landing-page-thumbnail-${currentTheme}.png`
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error('Failed to generate image:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  const renderBackground = () => {
    switch(currentTheme) {
      case 'gradient':
        return (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600" />
            <div className="absolute inset-0 bg-black/20" />
          </>
        )
      
      case 'neon':
        return (
          <>
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
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-[120px] animate-pulse delay-700" />
          </>
        )
      
      case 'glassmorphism':
        return (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20" />
            <div className="absolute inset-0 backdrop-blur-3xl" />
            <div className="absolute top-20 right-20 w-72 h-72 bg-purple-400/30 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl" />
            <div className="absolute inset-0 bg-white/5" />
          </>
        )
    }
  }

  const getTextStyles = () => {
    switch(currentTheme) {
      case 'gradient':
        return {
          title: "text-white drop-shadow-2xl",
          titleHighlight: "bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent",
          subtitle: "text-white/90 drop-shadow-lg",
          iconColor: "text-white"
        }
      
      case 'neon':
        return {
          title: "text-white",
          titleHighlight: "bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent",
          subtitle: "text-cyan-300",
          iconColor: "text-cyan-400"
        }
      
      case 'glassmorphism':
        return {
          title: "text-white drop-shadow-lg",
          titleHighlight: "bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent",
          subtitle: "text-white/80 drop-shadow-md",
          iconColor: "text-white/90"
        }
    }
  }

  const styles = getTextStyles()
  const bgClass = currentTheme === 'neon' ? 'bg-black' : 
                  currentTheme === 'glassmorphism' ? 'bg-gradient-to-br from-slate-900 to-purple-900' : 
                  'bg-white'

  return (
    <div className="w-full max-w-4xl mx-auto p-8 space-y-4">
      {/* 디자인 선택 버튼 */}
      <div className="flex justify-center gap-2 mb-4">
        <Button
          onClick={() => setCurrentTheme('gradient')}
          variant={currentTheme === 'gradient' ? 'default' : 'outline'}
          className="px-4 py-2"
        >
          그라데이션
        </Button>
        <Button
          onClick={() => setCurrentTheme('neon')}
          variant={currentTheme === 'neon' ? 'default' : 'outline'}
          className="px-4 py-2"
        >
          네온
        </Button>
        <Button
          onClick={() => setCurrentTheme('glassmorphism')}
          variant={currentTheme === 'glassmorphism' ? 'default' : 'outline'}
          className="px-4 py-2"
        >
          글래스모피즘
        </Button>
      </div>

      <Card ref={cardRef} className={`relative w-full aspect-[16/9] ${bgClass} overflow-hidden transition-all duration-500`} style={{ fontFamily: 'var(--font-pretendard)' }}>
        {/* 배경 렌더링 */}
        {renderBackground()}
        
        {/* 브라우저 UI */}
        <div className="absolute top-0 left-0 w-full p-4">
          <div className={`${currentTheme === 'neon' ? 'bg-black/60 border-cyan-500/30 shadow-[0_0_15px_rgba(0,255,255,0.3)]' : 
                          currentTheme === 'glassmorphism' ? 'bg-white/10 border-white/20' :
                          'bg-white/10 border-white/20'} backdrop-blur-md rounded-t-lg p-2 border`}>
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className={`w-3 h-3 rounded-full bg-red-500 ${currentTheme === 'neon' ? 'shadow-[0_0_10px_rgba(255,0,0,0.7)]' : ''}`} />
                <div className={`w-3 h-3 rounded-full bg-yellow-500 ${currentTheme === 'neon' ? 'shadow-[0_0_10px_rgba(255,255,0,0.7)]' : ''}`} />
                <div className={`w-3 h-3 rounded-full bg-green-500 ${currentTheme === 'neon' ? 'shadow-[0_0_10px_rgba(0,255,0,0.7)]' : ''}`} />
              </div>
              <div className={`flex-1 ${currentTheme === 'neon' ? 'bg-black/40 border-cyan-500/20' : 'bg-white/10'} rounded-md h-6 flex items-center px-3 border`}>
                <Globe className={`w-3 h-3 ${currentTheme === 'neon' ? 'text-cyan-400' : 'text-white/60'} mr-2`} />
                <span className={`text-xs ${currentTheme === 'neon' ? 'text-cyan-400' : 'text-white/60'}`}>your-landing-page.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* 메인 컨텐츠 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative z-10 text-center px-8">
            <div className="flex justify-center mb-6">
              {currentTheme === 'neon' ? (
                <div className="relative">
                  <Zap className="w-16 h-16 text-cyan-400 drop-shadow-2xl animate-pulse" />
                  <Zap className="w-16 h-16 text-cyan-400 absolute inset-0 blur-xl animate-pulse" />
                </div>
              ) : (
                <Zap className={`w-16 h-16 ${currentTheme === 'gradient' ? 'text-yellow-400' : 'text-white/80'} drop-shadow-2xl animate-pulse`} />
              )}
            </div>
            
            <h1 className={`text-5xl md:text-7xl ${styles.title} mb-4`}>
              <span className={`font-black tracking-tight ${currentTheme === 'neon' ? 'text-white' : ''}`} style={
                currentTheme === 'neon' ? { textShadow: '0 0 20px rgba(0,255,255,0.8), 0 0 40px rgba(0,255,255,0.5)' } : {}
              }>초고속</span>
              <br />
              <span className={`${styles.titleHighlight} font-extrabold tracking-tight`} style={
                currentTheme === 'neon' ? { filter: 'drop-shadow(0 0 20px rgba(0,255,255,0.5))' } : {}
              }>
                랜딩페이지 제작
              </span>
            </h1>
            
            <p className={`text-2xl md:text-3xl ${styles.subtitle} font-medium mt-6 tracking-wide`} style={
              currentTheme === 'neon' ? { textShadow: '0 0 10px rgba(0,255,255,0.6)' } : {}
            }>
              오늘 문의, 내일 완성
              <br />
              결과 보고 결제!
            </p>
            
            <div className="flex items-center justify-center gap-4 mt-8">
              {currentTheme === 'neon' ? (
                <>
                  <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] transition-all">
                    <Monitor className="w-8 h-8 text-purple-400" />
                  </div>
                  <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.4)] hover:shadow-[0_0_25px_rgba(59,130,246,0.6)] transition-all">
                    <Code2 className="w-8 h-8 text-blue-400" />
                  </div>
                  <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3 border border-cyan-500/30 shadow-[0_0_15px_rgba(0,255,255,0.4)] hover:shadow-[0_0_25px_rgba(0,255,255,0.6)] transition-all">
                    <Layout className="w-8 h-8 text-cyan-400" />
                  </div>
                </>
              ) : currentTheme === 'glassmorphism' ? (
                <>
                  <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/20">
                    <Monitor className="w-8 h-8 text-white/80" />
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/20">
                    <Code2 className="w-8 h-8 text-white/80" />
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/20">
                    <Layout className="w-8 h-8 text-white/80" />
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                    <Monitor className="w-8 h-8 text-white" />
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                    <Code2 className="w-8 h-8 text-white" />
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                    <Layout className="w-8 h-8 text-white" />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 하단 섹션 */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className={`${currentTheme === 'neon' ? 'bg-black/60 border-cyan-500/30' : 
                          currentTheme === 'glassmorphism' ? 'bg-white/10 border-white/20' :
                          'bg-white/10 border-white/20'} backdrop-blur-md p-4 border-t`}>
            <div className="grid grid-cols-3 gap-4">
              {currentTheme === 'neon' ? (
                <>
                  <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded h-20 border border-purple-500/20" />
                  <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded h-20 border border-blue-500/20" />
                  <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded h-20 border border-cyan-500/20" />
                </>
              ) : (
                <>
                  <div className={`${currentTheme === 'glassmorphism' ? 'bg-white/5' : 'bg-white/10'} rounded h-20`} />
                  <div className={`${currentTheme === 'glassmorphism' ? 'bg-white/5' : 'bg-white/10'} rounded h-20`} />
                  <div className={`${currentTheme === 'glassmorphism' ? 'bg-white/5' : 'bg-white/10'} rounded h-20`} />
                </>
              )}
            </div>
          </div>
        </div>

        {/* 반짝임 효과 */}
        {currentTheme === 'neon' ? (
          <>
            <Sparkles className="absolute top-20 right-20 w-8 h-8 text-cyan-400 animate-pulse drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]" />
            <Sparkles className="absolute bottom-32 left-20 w-6 h-6 text-purple-400 animate-pulse delay-150 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
            <Sparkles className="absolute top-32 left-32 w-5 h-5 text-blue-400 animate-pulse delay-300 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
          </>
        ) : currentTheme === 'gradient' ? (
          <>
            <Sparkles className="absolute top-20 right-20 w-8 h-8 text-yellow-300 animate-pulse" />
            <Sparkles className="absolute bottom-32 left-20 w-6 h-6 text-purple-300 animate-pulse delay-150" />
            <Sparkles className="absolute top-32 left-32 w-5 h-5 text-pink-300 animate-pulse delay-300" />
          </>
        ) : (
          <>
            <Sparkles className="absolute top-20 right-20 w-8 h-8 text-white/40 animate-pulse" />
            <Sparkles className="absolute bottom-32 left-20 w-6 h-6 text-white/30 animate-pulse delay-150" />
            <Sparkles className="absolute top-32 left-32 w-5 h-5 text-white/30 animate-pulse delay-300" />
          </>
        )}
      </Card>
      
      {/* 다운로드 버튼 */}
      <div className="flex justify-center">
        <Button
          onClick={handleDownload}
          disabled={isDownloading}
          className={currentTheme === 'neon' ? 
            "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium px-6 py-2 rounded-lg shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:shadow-[0_0_30px_rgba(0,255,255,0.5)] transition-all" :
            "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all"
          }
        >
          <Download className="w-4 h-4 mr-2" />
          {isDownloading ? '이미지 생성 중...' : '이미지 다운로드'}
        </Button>
      </div>
    </div>
  )
}
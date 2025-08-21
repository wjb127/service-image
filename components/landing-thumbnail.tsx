"use client"

import { Card } from "@/components/ui/card"
import { Monitor, Code2, Sparkles, Zap, Globe, Layout } from "lucide-react"

export default function LandingThumbnail() {
  return (
    <div className="w-full max-w-4xl mx-auto p-8">
      <Card className="relative w-full aspect-[16/9] bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 overflow-hidden" style={{ fontFamily: 'var(--font-pretendard)' }}>
        <div className="absolute inset-0 bg-black/20" />
        
        <div className="absolute top-0 left-0 w-full p-4">
          <div className="bg-white/10 backdrop-blur-md rounded-t-lg p-2 border border-white/20">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="flex-1 bg-white/10 rounded-md h-6 flex items-center px-3">
                <Globe className="w-3 h-3 text-white/60 mr-2" />
                <span className="text-xs text-white/60">your-landing-page.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative z-10 text-center px-8">
            <div className="flex justify-center mb-6">
              <Zap className="w-16 h-16 text-yellow-400 drop-shadow-2xl animate-pulse" />
            </div>
            
            <h1 className="text-5xl md:text-7xl text-white mb-4 drop-shadow-2xl">
              <span className="font-black tracking-tight">초고속</span>
              <br />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent font-extrabold tracking-tight">
                랜딩페이지 제작
              </span>
            </h1>
            
            <p className="text-2xl md:text-3xl text-white/95 font-medium mt-6 drop-shadow-lg tracking-wide">
              오늘 문의, 내일 완성, 1차시안 무료!
            </p>
            
            <div className="flex items-center justify-center gap-4 mt-8">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                <Monitor className="w-8 h-8 text-white" />
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                <Code2 className="w-8 h-8 text-white" />
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                <Layout className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <div className="bg-white/10 backdrop-blur-md p-4 border-t border-white/20">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/10 rounded h-20" />
              <div className="bg-white/10 rounded h-20" />
              <div className="bg-white/10 rounded h-20" />
            </div>
          </div>
        </div>

        <Sparkles className="absolute top-20 right-20 w-8 h-8 text-yellow-300 animate-pulse" />
        <Sparkles className="absolute bottom-32 left-20 w-6 h-6 text-purple-300 animate-pulse delay-150" />
        <Sparkles className="absolute top-32 left-32 w-5 h-5 text-pink-300 animate-pulse delay-300" />
      </Card>
    </div>
  )
}
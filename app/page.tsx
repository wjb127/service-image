"use client"

import { useState } from "react"
import TemplateSelector from "@/components/template-selector"
import AIGeneratedTemplateV2 from "@/components/templates/ai-generated-template-v2"
import { TemplateCategory } from "@/types/template"
import {
  EnhancedITServiceTemplate,
  EnhancedYouTubeTemplate,
  EnhancedInstagramTemplate,
  EnhancedProductTemplate,
  EnhancedDesignServiceTemplate,
  EnhancedComicTemplate
} from "@/components/templates/enhanced-wrapper"

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory>('it-service')

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          썸네일 생성기 ✨
        </h1>
        
        <TemplateSelector 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        
        <div className="mt-8">
          {selectedCategory === 'it-service' && <EnhancedITServiceTemplate />}
          {selectedCategory === 'youtube' && <EnhancedYouTubeTemplate />}
          {selectedCategory === 'instagram' && <EnhancedInstagramTemplate />}
          {selectedCategory === 'product' && <EnhancedProductTemplate />}
          {selectedCategory === 'design-service' && <EnhancedDesignServiceTemplate />}
          {selectedCategory === 'comic' && <EnhancedComicTemplate />}
          {selectedCategory === 'ai-generated' && <AIGeneratedTemplateV2 />}
        </div>
      </div>
    </div>
  )
}
"use client"

import { useState } from "react"
import LandingThumbnail from "@/components/landing-thumbnail"
import TemplateSelector from "@/components/template-selector"
import YoutubeTemplate from "@/components/templates/youtube-template"
import InstagramTemplate from "@/components/templates/instagram-template"
import ProductTemplate from "@/components/templates/product-template"
import DesignServiceTemplate from "@/components/templates/design-service-template"
import { TemplateCategory } from "@/types/template"

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
          {selectedCategory === 'it-service' && <LandingThumbnail />}
          {selectedCategory === 'youtube' && <YoutubeTemplate />}
          {selectedCategory === 'instagram' && <InstagramTemplate />}
          {selectedCategory === 'product' && <ProductTemplate />}
          {selectedCategory === 'design-service' && <DesignServiceTemplate />}
        </div>
      </div>
    </div>
  )
}
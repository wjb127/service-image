"use client"

import { useState } from "react"
import LandingThumbnailV2 from "@/components/landing-thumbnail-v2"
import TemplateSelector from "@/components/template-selector"
import YoutubeTemplateV2 from "@/components/templates/youtube-template-v2"
import InstagramTemplateV2 from "@/components/templates/instagram-template-v2"
import ProductDetailTemplate from "@/components/templates/product-detail-template"
import DesignServiceTemplateV2 from "@/components/templates/design-service-template-v2"
import ComicTemplate from "@/components/templates/comic-template"
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
          {selectedCategory === 'it-service' && <LandingThumbnailV2 />}
          {selectedCategory === 'youtube' && <YoutubeTemplateV2 />}
          {selectedCategory === 'instagram' && <InstagramTemplateV2 />}
          {selectedCategory === 'product' && <ProductDetailTemplate />}
          {selectedCategory === 'design-service' && <DesignServiceTemplateV2 />}
          {selectedCategory === 'comic' && <ComicTemplate />}
        </div>
      </div>
    </div>
  )
}
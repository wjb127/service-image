"use client"

import dynamic from 'next/dynamic'
import UniversalAITemplate from '@/components/universal-ai-template'

// 각 템플릿을 동적으로 import
const LandingThumbnailV2 = dynamic(() => import('@/components/landing-thumbnail-v2'), { ssr: false })
const YoutubeTemplateV2 = dynamic(() => import('@/components/templates/youtube-template-v2'), { ssr: false })
const InstagramTemplateV2 = dynamic(() => import('@/components/templates/instagram-template-v2'), { ssr: false })
const ProductDetailTemplateV2 = dynamic(() => import('@/components/templates/product-detail-template-v2'), { ssr: false })
const DesignServiceTemplateV2 = dynamic(() => import('@/components/templates/design-service-template-v2'), { ssr: false })
const ComicTemplate = dynamic(() => import('@/components/templates/comic-template'), { ssr: false })

// IT 서비스 템플릿 래퍼
export function EnhancedITServiceTemplate() {
  return (
    <UniversalAITemplate
      templateType="IT 서비스"
      defaultTemplate={<LandingThumbnailV2 />}
      TemplateComponent={LandingThumbnailV2}
    />
  )
}

// YouTube 템플릿 래퍼
export function EnhancedYouTubeTemplate() {
  return (
    <UniversalAITemplate
      templateType="YouTube"
      defaultTemplate={<YoutubeTemplateV2 />}
      TemplateComponent={YoutubeTemplateV2}
    />
  )
}

// Instagram 템플릿 래퍼
export function EnhancedInstagramTemplate() {
  return (
    <UniversalAITemplate
      templateType="Instagram"
      defaultTemplate={<InstagramTemplateV2 />}
      TemplateComponent={InstagramTemplateV2}
    />
  )
}

// 제품 상세 템플릿 래퍼
export function EnhancedProductTemplate() {
  return (
    <UniversalAITemplate
      templateType="제품 상세"
      defaultTemplate={<ProductDetailTemplateV2 />}
      TemplateComponent={ProductDetailTemplateV2}
    />
  )
}

// 디자인 서비스 템플릿 래퍼
export function EnhancedDesignServiceTemplate() {
  return (
    <UniversalAITemplate
      templateType="디자인 서비스"
      defaultTemplate={<DesignServiceTemplateV2 />}
      TemplateComponent={DesignServiceTemplateV2}
    />
  )
}

// 코믹 템플릿 래퍼
export function EnhancedComicTemplate() {
  return (
    <UniversalAITemplate
      templateType="코믹"
      defaultTemplate={<ComicTemplate />}
      TemplateComponent={ComicTemplate}
    />
  )
}
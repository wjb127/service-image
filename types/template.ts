export type TemplateCategory = 'it-service' | 'design-service' | 'youtube' | 'instagram' | 'product'

export interface TemplateConfig {
  category: TemplateCategory
  aspectRatio: string
  defaultSize: { width: number; height: number }
  elements: {
    [key: string]: {
      label: string
      defaultValue: boolean
      category: 'main' | 'sub' | 'decoration'
    }
  }
}

export const TEMPLATE_CONFIGS: Record<TemplateCategory, TemplateConfig> = {
  'it-service': {
    category: 'it-service',
    aspectRatio: '16/9',
    defaultSize: { width: 1200, height: 675 },
    elements: {
      showBrowserUI: { label: '브라우저 UI', defaultValue: true, category: 'main' },
      showHeroIcon: { label: '메인 아이콘', defaultValue: true, category: 'main' },
      showSubtitle: { label: '서브 텍스트', defaultValue: true, category: 'main' },
      showIconCards: { label: '아이콘 카드', defaultValue: true, category: 'sub' },
      showBottomSection: { label: '하단 섹션', defaultValue: true, category: 'sub' },
      showSparkles: { label: '반짝임 효과', defaultValue: true, category: 'decoration' },
    }
  },
  'design-service': {
    category: 'design-service',
    aspectRatio: '16/9',
    defaultSize: { width: 1200, height: 675 },
    elements: {
      showPortfolio: { label: '포트폴리오 그리드', defaultValue: true, category: 'main' },
      showColorPalette: { label: '색상 팔레트', defaultValue: true, category: 'main' },
      showProcess: { label: '작업 프로세스', defaultValue: true, category: 'sub' },
      showClients: { label: '클라이언트 로고', defaultValue: false, category: 'sub' },
    }
  },
  'youtube': {
    category: 'youtube',
    aspectRatio: '16/9',
    defaultSize: { width: 1280, height: 720 },
    elements: {
      showEmoji: { label: '이모지/리액션', defaultValue: true, category: 'main' },
      showBadge: { label: '뱃지 (NEW, HOT 등)', defaultValue: true, category: 'main' },
      showDuration: { label: '영상 길이', defaultValue: false, category: 'sub' },
      showArrow: { label: '화살표/포인터', defaultValue: true, category: 'decoration' },
    }
  },
  'instagram': {
    category: 'instagram',
    aspectRatio: '1/1',
    defaultSize: { width: 1080, height: 1080 },
    elements: {
      showPageNumber: { label: '페이지 번호', defaultValue: true, category: 'main' },
      showSwipeHint: { label: '스와이프 힌트', defaultValue: true, category: 'main' },
      showHashtags: { label: '해시태그', defaultValue: true, category: 'sub' },
      showCTA: { label: 'CTA 버튼', defaultValue: true, category: 'main' },
    }
  },
  'product': {
    category: 'product',
    aspectRatio: '1/1',
    defaultSize: { width: 800, height: 800 },
    elements: {
      showPrice: { label: '가격 표시', defaultValue: true, category: 'main' },
      showDiscount: { label: '할인율', defaultValue: true, category: 'main' },
      showShipping: { label: '배송 정보', defaultValue: true, category: 'sub' },
      showRating: { label: '별점/리뷰', defaultValue: false, category: 'sub' },
      showStock: { label: '재고 상태', defaultValue: false, category: 'sub' },
    }
  }
}

export const TEMPLATE_INFO = {
  'it-service': {
    name: 'IT/Tech 서비스',
    description: '웹/앱 서비스, SaaS 제품 홍보용',
    icon: '💻'
  },
  'design-service': {
    name: '디자인 서비스',
    description: '디자인 에이전시, 프리랜서 포트폴리오',
    icon: '🎨'
  },
  'youtube': {
    name: '유튜브 썸네일',
    description: '조회수를 높이는 임팩트 있는 썸네일',
    icon: '📺'
  },
  'instagram': {
    name: '인스타그램 카드뉴스',
    description: '스와이프형 정보 전달 콘텐츠',
    icon: '📱'
  },
  'product': {
    name: '상품 썸네일',
    description: '이커머스, 쇼핑몰 상품 이미지',
    icon: '🛍️'
  }
}
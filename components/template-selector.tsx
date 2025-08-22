"use client"

import { Card } from "@/components/ui/card"
import { TEMPLATE_INFO, TemplateCategory } from "@/types/template"

interface TemplateSelectorProps {
  selectedCategory: TemplateCategory
  onCategoryChange: (category: TemplateCategory) => void
}

export default function TemplateSelector({ selectedCategory, onCategoryChange }: TemplateSelectorProps) {
  return (
    <div className="w-full mb-6">
      <h2 className="text-lg font-bold mb-4 text-center">템플릿 선택</h2>
      <div className="grid grid-cols-3 gap-3">
        {(Object.keys(TEMPLATE_INFO) as TemplateCategory[]).map((category) => {
          const info = TEMPLATE_INFO[category]
          return (
            <Card
              key={category}
              onClick={() => onCategoryChange(category)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onCategoryChange(category)
                }
              }}
              className={`
                p-4 cursor-pointer transition-all hover:scale-105
                ${selectedCategory === category 
                  ? 'ring-2 ring-blue-500 bg-blue-50' 
                  : 'hover:bg-gray-50'
                }
              `}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">{info.icon}</div>
                <h3 className="font-semibold text-sm mb-1">{info.name}</h3>
                <p className="text-xs text-gray-600">{info.description}</p>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
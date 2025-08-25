import React from 'react'

interface WatermarkProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  opacity?: number
  size?: 'small' | 'medium' | 'large'
  text?: string
}

export default function Watermark({ 
  position = 'bottom-right', 
  opacity = 0.6,
  size = 'small',
  text = 'service-image.vercel.app'
}: WatermarkProps) {
  const positionStyles = {
    'top-left': 'top-3 left-3',
    'top-right': 'top-3 right-3',
    'bottom-left': 'bottom-3 left-3',
    'bottom-right': 'bottom-3 right-3'
  }

  const sizeStyles = {
    small: 'text-[10px] px-2 py-1',
    medium: 'text-xs px-2.5 py-1',
    large: 'text-sm px-3 py-1.5'
  }

  const iconSizes = {
    small: 'w-3 h-3',
    medium: 'w-3.5 h-3.5',
    large: 'w-4 h-4'
  }

  // URL 추출 (https:// 제거)
  const displayText = text.replace(/^https?:\/\//, '')

  return (
    <div 
      className={`absolute ${positionStyles[position]} z-50 pointer-events-none`}
      style={{ opacity }}
    >
      <a
        href={text.startsWith('http') ? text : `https://${text}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`
          inline-flex items-center gap-1.5
          bg-gradient-to-r from-white/95 to-white/90
          backdrop-blur-md
          text-gray-600
          rounded-full
          shadow-[0_2px_8px_rgba(0,0,0,0.08)]
          border border-white/50
          hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)]
          hover:text-gray-800
          hover:from-white to-white/95
          transition-all duration-300
          pointer-events-auto
          ${sizeStyles[size]}
        `}
        style={{
          fontWeight: '500',
          letterSpacing: '0.01em'
        }}
      >
        <svg 
          viewBox="0 0 24 24" 
          className={`${iconSizes[size]} flex-shrink-0`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 8v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8m18 0-9 6-9-6m18 0a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2m18 0L12 14l-9-6" />
          <circle cx="12" cy="12" r="0" fill="currentColor">
            <animate attributeName="r" from="0" to="3" dur="1.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="1" to="0" dur="1.5s" repeatCount="indefinite" />
          </circle>
        </svg>
        <span className="select-none">{displayText}</span>
      </a>
    </div>
  )
}
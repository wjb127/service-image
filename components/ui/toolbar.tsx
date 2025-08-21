import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface ToolbarProps {
  children: ReactNode
  className?: string
}

export function Toolbar({ children, className }: ToolbarProps) {
  return (
    <div className={cn(
      "bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-3 shadow-sm flex-wrap",
      className
    )}>
      {children}
    </div>
  )
}

interface ToolbarSectionProps {
  children: ReactNode
  className?: string
}

export function ToolbarSection({ children, className }: ToolbarSectionProps) {
  return (
    <div className={cn(
      "flex items-center gap-2 px-2 border-r border-gray-200 last:border-r-0",
      className
    )}>
      {children}
    </div>
  )
}

interface ToolbarButtonProps {
  children: ReactNode
  onClick?: () => void
  active?: boolean
  className?: string
  disabled?: boolean
  tooltip?: string
}

export function ToolbarButton({ 
  children, 
  onClick, 
  active = false, 
  className,
  disabled = false,
  tooltip
}: ToolbarButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={tooltip}
      className={cn(
        "px-3 py-1.5 rounded hover:bg-gray-100 transition-colors text-sm font-medium flex items-center gap-2",
        active && "bg-gray-100 text-blue-600",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {children}
    </button>
  )
}

interface ToolbarSelectProps {
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  className?: string
  label?: string
}

export function ToolbarSelect({ 
  value, 
  onChange, 
  options, 
  className,
  label
}: ToolbarSelectProps) {
  return (
    <div className="flex items-center gap-2">
      {label && <span className="text-sm text-gray-600">{label}:</span>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "px-2 py-1 border border-gray-200 rounded text-sm",
          className
        )}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

interface ToolbarColorPickerProps {
  value: string
  onChange: (value: string) => void
  label?: string
  className?: string
}

export function ToolbarColorPicker({
  value,
  onChange,
  label,
  className
}: ToolbarColorPickerProps) {
  return (
    <div className="flex items-center gap-2">
      {label && <span className="text-sm text-gray-600">{label}:</span>}
      <div className="relative">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-8 h-8 border border-gray-300 rounded cursor-pointer",
            className
          )}
        />
      </div>
    </div>
  )
}

interface ToolbarToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  className?: string
}

export function ToolbarToggle({
  checked,
  onChange,
  label,
  className
}: ToolbarToggleProps) {
  return (
    <label className={cn("flex items-center gap-2 cursor-pointer", className)}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4"
      />
      <span className="text-sm">{label}</span>
    </label>
  )
}
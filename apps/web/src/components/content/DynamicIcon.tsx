import * as LucideIcons from 'lucide-react'

interface DynamicIconProps {
  name: string
  className?: string
  size?: number
  style?: React.CSSProperties
}

/**
 * Dynamic icon component that renders Lucide icons by name
 */
export function DynamicIcon({ name, className = '', size, style }: DynamicIconProps) {
  // Get the icon component from Lucide
  const IconComponent = (LucideIcons as Record<string, unknown>)[name] as React.ComponentType<{ className?: string; size?: number; style?: React.CSSProperties }>

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in Lucide icons`)
    // Return a fallback icon
    return <LucideIcons.HelpCircle className={className} size={size} style={style} />
  }

  return <IconComponent className={className} size={size} style={style} />
}
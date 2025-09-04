import * as LucideIcons from 'lucide-react'

interface DynamicIconProps {
  name: string
  className?: string
  size?: number
}

/**
 * Dynamic icon component that renders Lucide icons by name
 */
export function DynamicIcon({ name, className = '', size }: DynamicIconProps) {
  // Get the icon component from Lucide
  const IconComponent = (LucideIcons as Record<string, unknown>)[name] as React.ComponentType<{ className?: string; size?: number }>
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in Lucide icons`)
    // Return a fallback icon
    return <LucideIcons.HelpCircle className={className} size={size} />
  }
  
  return <IconComponent className={className} size={size} />
}
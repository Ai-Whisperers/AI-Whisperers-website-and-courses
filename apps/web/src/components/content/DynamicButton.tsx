import { Button } from '@/components/ui/button'
import { DynamicIcon } from './DynamicIcon'
import type { Button as ButtonContent } from '@/types/content'

interface DynamicButtonProps {
  content: ButtonContent
  className?: string
  style?: React.CSSProperties
  onMouseEnter?: (e: React.MouseEvent<HTMLButtonElement>) => void
  onMouseLeave?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

/**
 * Dynamic button component that renders based on content configuration
 */
export function DynamicButton({ content, className = '', style, onMouseEnter, onMouseLeave }: DynamicButtonProps) {
  const handleClick = () => {
    if (content.href) {
      window.open(content.href, content.href.startsWith('http') ? '_blank' : '_self')
    }

    if (content.onClick) {
      // In a real app, you might have a function registry or eval (be careful with eval!)
      console.log(`Button click handler: ${content.onClick}`)
    }
  }

  return (
    <Button
      variant={content.variant || 'default'}
      size={content.size || 'default'}
      className={className}
      style={style}
      onClick={handleClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {content.icon && (
        <DynamicIcon
          name={content.icon}
          className="mr-2 h-5 w-5"
        />
      )}
      {content.text}
    </Button>
  )
}
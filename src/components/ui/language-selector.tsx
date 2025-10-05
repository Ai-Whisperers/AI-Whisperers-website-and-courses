// Language Selector Component
// Multi-language selector with enhanced UI

'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/i18n'
import { LANGUAGES, Language } from '@/lib/i18n/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface LanguageSelectorProps {
  variant?: 'dropdown' | 'inline' | 'compact'
  className?: string
}

export function LanguageSelector({ 
  variant = 'dropdown', 
  className 
}: LanguageSelectorProps) {
  const { language, setLanguage, isLoading } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage)
    setIsOpen(false)
  }

  const currentLanguage = LANGUAGES[language]

  if (isLoading) {
    return (
      <div className="w-8 h-8 rounded bg-muted animate-pulse" />
    )
  }

  if (variant === 'compact') {
    return (
      <div className={cn('relative', className)}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="h-8 w-8 p-0"
        >
          <span className="text-lg">{currentLanguage.flag}</span>
        </Button>
        
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsOpen(false)}
            />
            <Card className="absolute right-0 top-full mt-2 z-20 min-w-[180px]">
              <CardContent className="p-2">
                {Object.values(LANGUAGES).map((lang) => (
                  <Button
                    key={lang.code}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLanguageChange(lang.code)}
                    className={cn(
                      'w-full justify-start gap-3 h-auto p-2',
                      language === lang.code && 'bg-primary/10 text-primary'
                    )}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <div className="text-left">
                      <div className="font-medium">{lang.nativeName}</div>
                      <div className="text-xs text-muted-foreground">
                        {lang.name}
                      </div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    )
  }

  if (variant === 'inline') {
    return (
      <div className={cn('flex gap-1', className)}>
        {Object.values(LANGUAGES).map((lang) => (
          <Button
            key={lang.code}
            variant={language === lang.code ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleLanguageChange(lang.code)}
            className="h-8 px-2"
          >
            <span className="mr-1">{lang.flag}</span>
            {lang.code.toUpperCase()}
          </Button>
        ))}
      </div>
    )
  }

  // Default dropdown variant
  return (
    <div className={cn('relative', className)}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2 min-w-[120px] justify-between"
      >
        <div className="flex items-center gap-2">
          <span>{currentLanguage.flag}</span>
          <span className="hidden sm:inline">{currentLanguage.nativeName}</span>
          <span className="sm:hidden">{currentLanguage.code.toUpperCase()}</span>
        </div>
        <svg
          className={cn(
            'h-4 w-4 transition-transform',
            isOpen && 'rotate-180'
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </Button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <Card className="absolute right-0 top-full mt-2 z-20 min-w-[200px]">
            <CardContent className="p-2">
              {Object.values(LANGUAGES).map((lang) => (
                <Button
                  key={lang.code}
                  variant="ghost"
                  onClick={() => handleLanguageChange(lang.code)}
                  className={cn(
                    'w-full justify-start gap-3 h-auto p-3',
                    language === lang.code && 'bg-primary/10 text-primary font-medium'
                  )}
                >
                  <span className="text-xl">{lang.flag}</span>
                  <div className="text-left">
                    <div className="font-medium">{lang.nativeName}</div>
                    <div className="text-xs text-muted-foreground">
                      {lang.name}
                    </div>
                  </div>
                  {language === lang.code && (
                    <div className="ml-auto">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </Button>
              ))}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
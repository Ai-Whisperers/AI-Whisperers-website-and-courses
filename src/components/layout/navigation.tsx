// Navigation Component
// Main site navigation with authentication integration

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useAuth } from '@/contexts/security'
import { useTranslation } from '@/lib/i18n/use-translation'
import { Button } from '@/components/ui/button'
import { LanguageSelector } from '@/components/ui/language-selector'
import { cn } from '@/lib/utils'
import { Brain } from 'lucide-react'
import { useLocalizedRoutes } from '@/hooks/useLocalizedRoutes'

export function Navigation() {
  const pathname = usePathname()
  const { user, isAuthenticated, logout } = useAuth()
  const { t } = useTranslation()
  const { routes: localRoutes } = useLocalizedRoutes()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigationItems = [
    { href: localRoutes.public.home, label: t('nav.home') },
    { href: localRoutes.public.courses, label: t('nav.courses') },
    { href: localRoutes.public.services, label: t('nav.services') },
    { href: localRoutes.public.solutions, label: t('nav.solutions') },
    { href: localRoutes.public.about, label: t('nav.about') },
    { href: localRoutes.public.contact, label: t('nav.contact') },
  ]

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={localRoutes.public.home} className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-primary" />
            <div className="font-bold text-xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              AI Whisperers
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  isActive(item.href)
                    ? 'text-primary'
                    : 'text-muted-foreground'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Side - Auth + Language */}
          <div className="flex items-center space-x-4">
            <LanguageSelector variant="compact" />
            
            {isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-3">
                {user?.canAccessAdmin() && (
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={localRoutes.admin.dashboard}>Admin</Link>
                  </Button>
                )}
                <Button variant="ghost" size="sm" asChild>
                  <Link href={localRoutes.protected.dashboard}>{t('nav.dashboard')}</Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => logout()}
                >
                  {t('nav.signOut')}
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={localRoutes.auth.signin}>{t('nav.signIn')}</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href={localRoutes.auth.signin}>Get Started</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'block px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive(item.href)
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-primary hover:bg-accent'
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              <div className="border-t border-border pt-3 mt-3">
                {isAuthenticated ? (
                  <div className="space-y-1">
                    <Link
                      href={localRoutes.protected.dashboard}
                      className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-accent rounded-md"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t('nav.dashboard')}
                    </Link>
                    {user?.canAccessAdmin() && (
                      <Link
                        href={localRoutes.admin.dashboard}
                        className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-accent rounded-md"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Admin
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout()
                        setIsMobileMenuOpen(false)
                      }}
                      className="block w-full text-left px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-accent rounded-md"
                    >
                      {t('nav.signOut')}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Link
                      href={localRoutes.auth.signin}
                      className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-accent rounded-md"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t('nav.signIn')}
                    </Link>
                    <Link
                      href={localRoutes.auth.signin}
                      className="block px-3 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
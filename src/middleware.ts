/**
 * Next.js Middleware for i18n Routing
 * Handles locale detection, URL rewriting, and cookie persistence
 *
 * URL patterns supported:
 * - /            → / (default locale: en)
 * - /es          → /es (Spanish homepage)
 * - /es/courses  → /es/courses (Spanish courses)
 * - /courses     → /courses (default locale: en)
 */

import { NextRequest, NextResponse } from 'next/server'
import { i18nConfig } from './lib/i18n/config'
import type { Language } from './lib/i18n/types'

const LOCALE_COOKIE_NAME = 'NEXT_LOCALE'

/**
 * Extract locale from pathname
 * /es/courses → 'es'
 * /courses → null
 */
function getLocaleFromPathname(pathname: string): Language | null {
  const segments = pathname.split('/').filter(Boolean)
  const firstSegment = segments[0]

  if (firstSegment && i18nConfig.supportedLanguages.includes(firstSegment as Language)) {
    return firstSegment as Language
  }

  return null
}

/**
 * Detect preferred locale from Accept-Language header
 */
function getLocaleFromAcceptLanguage(request: NextRequest): Language | null {
  const acceptLanguage = request.headers.get('accept-language')
  if (!acceptLanguage) return null

  // Parse Accept-Language header (e.g., "en-US,en;q=0.9,es;q=0.8")
  const languages = acceptLanguage
    .split(',')
    .map(lang => lang.split(';')[0].trim().toLowerCase().split('-')[0])

  for (const lang of languages) {
    if (i18nConfig.supportedLanguages.includes(lang as Language)) {
      return lang as Language
    }
  }

  return null
}

/**
 * Get locale with priority:
 * 1. URL path (/es/...)
 * 2. Cookie
 * 3. Accept-Language header
 * 4. Default locale
 */
function getLocale(request: NextRequest): Language {
  // 1. Check URL path
  const pathnameLocale = getLocaleFromPathname(request.nextUrl.pathname)
  if (pathnameLocale) return pathnameLocale

  // 2. Check cookie
  const cookieLocale = request.cookies.get(LOCALE_COOKIE_NAME)?.value
  if (cookieLocale && i18nConfig.supportedLanguages.includes(cookieLocale as Language)) {
    return cookieLocale as Language
  }

  // 3. Check Accept-Language header (if auto-detect enabled)
  if (i18nConfig.autoDetect) {
    const browserLocale = getLocaleFromAcceptLanguage(request)
    if (browserLocale) return browserLocale
  }

  // 4. Return default locale
  return i18nConfig.defaultLanguage
}

/**
 * Check if pathname should skip i18n middleware
 */
function shouldSkipMiddleware(pathname: string): boolean {
  // Skip API routes
  if (pathname.startsWith('/api/')) return true

  // Skip Next.js internals
  if (pathname.startsWith('/_next/')) return true

  // Skip static files
  if (pathname.match(/\.(ico|png|jpg|jpeg|gif|svg|webp|woff|woff2|ttf|otf|eot)$/)) return true

  // Skip public files
  if (pathname.startsWith('/images/')) return true
  if (pathname.startsWith('/fonts/')) return true
  if (pathname === '/favicon.ico') return true
  if (pathname === '/robots.txt') return true
  if (pathname === '/sitemap.xml') return true

  return false
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Skip middleware for certain paths
  if (shouldSkipMiddleware(pathname)) {
    return NextResponse.next()
  }

  // Get current locale
  const locale = getLocale(request)
  const pathnameLocale = getLocaleFromPathname(pathname)

  // Create response
  let response: NextResponse

  // Case 1: Path has locale prefix already
  if (pathnameLocale) {
    // Just continue, locale is correct
    response = NextResponse.next()
  }
  // Case 2: Path has no locale prefix
  else {
    // For default locale (en), don't redirect - keep clean URLs
    if (locale === i18nConfig.defaultLanguage) {
      response = NextResponse.next()
    }
    // For non-default locale, redirect to /{locale}{pathname}
    else {
      const url = request.nextUrl.clone()
      url.pathname = `/${locale}${pathname}`
      response = NextResponse.redirect(url)
    }
  }

  // Set locale cookie for persistence
  if (i18nConfig.persist) {
    response.cookies.set(LOCALE_COOKIE_NAME, locale, {
      httpOnly: false, // Allow JavaScript access for client-side routing
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: '/',
    })
  }

  // Add locale to response headers for use in server components
  response.headers.set('x-locale', locale)

  return response
}

/**
 * Middleware matcher configuration
 * Run middleware on all routes except those matched in shouldSkipMiddleware
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next (Next.js internals)
     * - static files (images, fonts, etc.)
     */
    '/((?!api|_next/static|_next/image|images|fonts|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
}

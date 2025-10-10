/**
 * Centralized Routes Configuration
 * All application routes defined here with environment variable support
 * Never hardcode routes - always import from this file
 *
 * i18n Support:
 * - Routes automatically include locale prefix when needed (/es/courses)
 * - Default locale (en) has clean URLs (/courses)
 * - Use getLocalizedPath() for manual locale prefix
 */

import type { Language } from '@/lib/i18n/types'
import { i18nConfig } from '@/lib/i18n/config'

// Base URL from environment or default to localhost
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

// Route prefix from environment (useful for subdirectory deployments)
const ROUTE_PREFIX = process.env.NEXT_PUBLIC_ROUTE_PREFIX || ''

/**
 * Helper to construct absolute URLs
 */
function getAbsoluteUrl(path: string): string {
  return `${BASE_URL}${ROUTE_PREFIX}${path}`
}

/**
 * Helper to construct relative paths with prefix
 */
function getPath(path: string): string {
  return `${ROUTE_PREFIX}${path}`
}

/**
 * Helper to add locale prefix to a path
 * - Default locale (en): /courses → /courses (no prefix)
 * - Other locales: /courses → /es/courses
 */
export function getLocalizedPath(path: string, locale?: Language): string {
  // If no locale provided or it's the default locale, return path as-is
  if (!locale || locale === i18nConfig.defaultLanguage) {
    return getPath(path)
  }

  // For non-default locales, add locale prefix
  return getPath(`/${locale}${path}`)
}

/**
 * Get current locale from pathname
 * /es/courses → 'es'
 * /courses → 'en' (default)
 */
export function getLocaleFromPathname(pathname: string): Language {
  const segments = pathname.split('/').filter(Boolean)
  const firstSegment = segments[0]

  if (firstSegment && i18nConfig.supportedLanguages.includes(firstSegment as Language)) {
    return firstSegment as Language
  }

  return i18nConfig.defaultLanguage
}

/**
 * Switch locale in a pathname
 * /es/courses → /en/courses (or just /courses for default locale)
 */
export function switchLocaleInPath(pathname: string, newLocale: Language): string {
  const currentLocale = getLocaleFromPathname(pathname)

  // Remove current locale prefix if it exists
  let basePath = pathname
  if (currentLocale !== i18nConfig.defaultLanguage) {
    basePath = pathname.replace(`/${currentLocale}`, '')
  }

  // Add new locale prefix if needed
  return getLocalizedPath(basePath || '/', newLocale)
}

/**
 * Public Routes Configuration
 * These routes are accessible without authentication
 */
export const publicRoutes = {
  // Main navigation
  home: getPath('/'),
  courses: getPath('/courses'),
  services: getPath('/services'),
  solutions: getPath('/solutions'),
  about: getPath('/about'),
  contact: getPath('/contact'),

  // Content pages
  blog: getPath('/blog'),
  faq: getPath('/faq'),

  // Legal pages
  privacy: getPath('/privacy'),
  terms: getPath('/terms'),
  refund: getPath('/refund'),

  // Support
  help: getPath('/help'),
  careers: getPath('/careers'),

  // Course pages (dynamic)
  courseDetail: (slug: string) => getPath(`/courses/${slug}`),

  // Blog posts (dynamic)
  blogPost: (slug: string) => getPath(`/blog/${slug}`),
} as const

/**
 * Authentication Routes Configuration
 */
export const authRoutes = {
  signin: getPath('/auth/signin'),
  signup: getPath('/auth/signup'),
  signout: getPath('/auth/signout'),
  forgotPassword: getPath('/auth/forgot-password'),
  resetPassword: getPath('/auth/reset-password'),
  verifyEmail: getPath('/auth/verify-email'),

  // OAuth callbacks
  callback: getPath('/auth/callback'),
} as const

/**
 * Protected Routes Configuration
 * Require authentication
 */
export const protectedRoutes = {
  // User dashboard
  dashboard: getPath('/dashboard'),
  profile: getPath('/dashboard/profile'),
  settings: getPath('/dashboard/settings'),
  billing: getPath('/dashboard/billing'),

  // Learning paths
  myCourses: getPath('/dashboard/courses'),
  courseProgress: (slug: string) => getPath(`/dashboard/courses/${slug}`),

  // Certificates
  certificates: getPath('/dashboard/certificates'),
} as const

/**
 * Admin Routes Configuration
 * Require admin privileges
 */
export const adminRoutes = {
  dashboard: getPath('/admin'),
  users: getPath('/admin/users'),
  courses: getPath('/admin/courses'),
  content: getPath('/admin/content'),
  analytics: getPath('/admin/analytics'),
  settings: getPath('/admin/settings'),

  // Course management
  editCourse: (id: string) => getPath(`/admin/courses/${id}/edit`),
  createCourse: getPath('/admin/courses/new'),
} as const

/**
 * API Routes Configuration
 */
export const apiRoutes = {
  // Authentication
  auth: {
    session: getPath('/api/auth/session'),
    csrf: getPath('/api/auth/csrf'),
    providers: getPath('/api/auth/providers'),
  },

  // Courses
  courses: {
    list: getPath('/api/courses'),
    detail: (id: string) => getPath(`/api/courses/${id}`),
    enroll: (id: string) => getPath(`/api/courses/${id}/enroll`),
  },

  // User
  user: {
    profile: getPath('/api/user/profile'),
    progress: getPath('/api/user/progress'),
    certificates: getPath('/api/user/certificates'),
  },

  // Payments
  payments: {
    createCheckout: getPath('/api/payments/create-checkout'),
    webhook: getPath('/api/payments/webhook'),
  },
} as const

/**
 * External Links Configuration
 */
export const externalLinks = {
  // Social media (from environment variables)
  twitter: process.env.NEXT_PUBLIC_TWITTER_URL || '#',
  linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || '#',
  github: process.env.NEXT_PUBLIC_GITHUB_ORG || 'https://github.com/Ai-Whisperers',
  youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL || '#',
  discord: process.env.NEXT_PUBLIC_DISCORD_URL || '#',

  // Company
  companyWebsite: process.env.NEXT_PUBLIC_COMPANY_WEBSITE || BASE_URL,
  supportEmail: `mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@example.com'}`,
  salesEmail: `mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'sales@example.com'}`,
} as const

/**
 * All routes combined for easy access
 */
export const routes = {
  public: publicRoutes,
  auth: authRoutes,
  protected: protectedRoutes,
  admin: adminRoutes,
  api: apiRoutes,
  external: externalLinks,

  // Absolute URL helpers
  absoluteUrl: getAbsoluteUrl,

  // Check if route requires auth
  isProtectedRoute: (path: string): boolean => {
    return path.startsWith(protectedRoutes.dashboard) ||
           path.startsWith(adminRoutes.dashboard)
  },

  // Check if route is admin only
  isAdminRoute: (path: string): boolean => {
    return path.startsWith(adminRoutes.dashboard)
  },
} as const

/**
 * Navigation Items Configuration
 * Used by Header/Footer components
 */
export interface NavItem {
  label: string
  href: string
  requiresAuth?: boolean
  requiresAdmin?: boolean
}

/**
 * Get main navigation items
 * These should use i18n keys for labels
 */
export function getMainNavigation(): Omit<NavItem, 'label'>[] {
  return [
    { href: publicRoutes.home },
    { href: publicRoutes.courses },
    { href: publicRoutes.services },
    { href: publicRoutes.solutions },
    { href: publicRoutes.about },
    { href: publicRoutes.contact },
  ]
}

/**
 * Get footer navigation sections
 */
export function getFooterNavigation() {
  return {
    courses: [
      { href: publicRoutes.courses, label: 'footer.courses.all' },
      { href: publicRoutes.courseDetail('ai-foundations'), label: 'footer.courses.foundations' },
      { href: publicRoutes.courseDetail('applied-ai'), label: 'footer.courses.applied' },
      { href: publicRoutes.courseDetail('ai-web-development'), label: 'footer.courses.webdev' },
      { href: publicRoutes.courseDetail('enterprise-ai'), label: 'footer.courses.enterprise' },
    ],
    company: [
      { href: publicRoutes.about, label: 'footer.company.about' },
      { href: publicRoutes.blog, label: 'footer.company.blog' },
      { href: publicRoutes.contact, label: 'footer.company.contact' },
      { href: publicRoutes.careers, label: 'footer.company.careers' },
    ],
    support: [
      { href: publicRoutes.help, label: 'footer.support.help' },
      { href: publicRoutes.privacy, label: 'footer.support.privacy' },
      { href: publicRoutes.terms, label: 'footer.support.terms' },
      { href: publicRoutes.refund, label: 'footer.support.refund' },
    ],
    social: [
      { href: externalLinks.twitter, label: 'Twitter', icon: 'twitter' },
      { href: externalLinks.linkedin, label: 'LinkedIn', icon: 'linkedin' },
      { href: externalLinks.github, label: 'GitHub', icon: 'github' },
    ],
  }
}

// Type exports
export type PublicRoutes = typeof publicRoutes
export type AuthRoutes = typeof authRoutes
export type ProtectedRoutes = typeof protectedRoutes
export type AdminRoutes = typeof adminRoutes
export type ExternalLinks = typeof externalLinks

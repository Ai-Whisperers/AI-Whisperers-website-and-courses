/**
 * Custom hook to get locale-aware routes
 * Use this in client components to get routes with proper locale prefix
 *
 * Features:
 * - Automatically detects current locale from URL
 * - Returns routes with appropriate locale prefix
 * - Provides switchLocale helper for language switching
 *
 * Usage:
 * ```tsx
 * const { routes, locale, switchLocale } = useLocalizedRoutes()
 *
 * <Link href={routes.public.courses}>Courses</Link>
 * <Link href={routes.auth.signin}>Sign In</Link>
 * <button onClick={() => router.push(switchLocale('es'))}>ES</button>
 * ```
 */

'use client'

import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import {
  getLocalizedPath,
  getLocaleFromPathname,
  switchLocaleInPath,
  externalLinks,
} from '@/config/routes'
import type { Language } from '@/lib/i18n/types'

export function useLocalizedRoutes() {
  const pathname = usePathname()
  const locale = useMemo(() => getLocaleFromPathname(pathname), [pathname])

  const localizedRoutes = useMemo(() => {
    // Helper to localize a single route
    const loc = (path: string) => getLocalizedPath(path, locale)

    return {
      public: {
        home: loc('/'),
        courses: loc('/courses'),
        services: loc('/services'),
        solutions: loc('/solutions'),
        about: loc('/about'),
        contact: loc('/contact'),
        blog: loc('/blog'),
        faq: loc('/faq'),
        privacy: loc('/privacy'),
        terms: loc('/terms'),
        refund: loc('/refund'),
        help: loc('/help'),
        careers: loc('/careers'),
        courseDetail: (slug: string) => loc(`/courses/${slug}`),
        blogPost: (slug: string) => loc(`/blog/${slug}`),
      },
      auth: {
        signin: loc('/auth/signin'),
        signup: loc('/auth/signup'),
        signout: loc('/auth/signout'),
        forgotPassword: loc('/auth/forgot-password'),
        resetPassword: loc('/auth/reset-password'),
        verifyEmail: loc('/auth/verify-email'),
        callback: loc('/auth/callback'),
      },
      protected: {
        dashboard: loc('/dashboard'),
        profile: loc('/dashboard/profile'),
        settings: loc('/dashboard/settings'),
        billing: loc('/dashboard/billing'),
        myCourses: loc('/dashboard/courses'),
        courseProgress: (slug: string) => loc(`/dashboard/courses/${slug}`),
        certificates: loc('/dashboard/certificates'),
      },
      admin: {
        dashboard: loc('/admin'),
        users: loc('/admin/users'),
        courses: loc('/admin/courses'),
        content: loc('/admin/content'),
        analytics: loc('/admin/analytics'),
        settings: loc('/admin/settings'),
        editCourse: (id: string) => loc(`/admin/courses/${id}/edit`),
        createCourse: loc('/admin/courses/new'),
      },
      external: externalLinks,
    }
  }, [locale])

  return {
    routes: localizedRoutes,
    locale,
    switchLocale: (newLocale: Language) => switchLocaleInPath(pathname, newLocale),
  }
}

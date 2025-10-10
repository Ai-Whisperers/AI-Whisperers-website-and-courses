/**
 * Application Routes
 * Shared constants for route paths
 *
 * ✅ PHASE 2B: Frontend/Backend Separation
 */

export const ROUTES = {
  // Public pages
  HOME: '/',
  COURSES: '/courses',
  COURSE_DETAIL: (slug: string) => `/courses/${slug}`,
  ABOUT: '/about',
  CONTACT: '/contact',
  SERVICES: '/services',

  // Authentication
  SIGN_IN: '/auth/signin',
  SIGN_UP: '/auth/signup',
  SIGN_OUT: '/auth/signout',

  // Protected pages
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',

  // Admin
  ADMIN: '/admin',
  ADMIN_COURSES: '/admin/courses',
  ADMIN_USERS: '/admin/users',
  ADMIN_ANALYTICS: '/admin/analytics',
} as const

export const API_ROUTES = {
  // Courses
  COURSES: '/api/courses',
  COURSE_DETAIL: (slug: string) => `/api/courses/${slug}`,
  COURSE_ENROLL: (slug: string) => `/api/courses/${slug}/enroll`,

  // User
  USER_PROFILE: '/api/user/profile',
  USER_COURSES: '/api/user/courses',
  USER_ENROLLMENTS: '/api/user/courses/enrolled',
  USER_DASHBOARD: '/api/user/dashboard',

  // Admin
  ADMIN_STATS: '/api/admin/stats',

  // Health
  HEALTH: '/api/health',
} as const

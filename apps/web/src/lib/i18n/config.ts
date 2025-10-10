/**
 * Internationalization (i18n) Configuration
 * Complete i18n system for the educational platform
 *
 * Now powered by environment variables for deployment flexibility
 * @module i18n/config
 */

import { Language, LANGUAGES } from './types'

/**
 * Main i18n configuration object
 * All values loaded from environment variables with sensible defaults
 */
export const i18nConfig = {
  defaultLanguage: (process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE as Language) || 'en',
  fallbackLanguage: (process.env.NEXT_PUBLIC_FALLBACK_LANGUAGE as Language) || 'en',

  supportedLanguages: (
    process.env.NEXT_PUBLIC_SUPPORTED_LANGUAGES?.split(',').map(l => l.trim()) as Language[]
  ) || ['en', 'es'],

  autoDetect: process.env.NEXT_PUBLIC_AUTO_DETECT_LANGUAGE !== 'false',
  persist: process.env.NEXT_PUBLIC_PERSIST_LANGUAGE !== 'false',

  features: {
    spanish: process.env.NEXT_PUBLIC_ENABLE_SPANISH !== 'false',
    routeLocale: process.env.NEXT_PUBLIC_ENABLE_ROUTE_LOCALE === 'true',
    showSelector: process.env.NEXT_PUBLIC_SHOW_LANGUAGE_SELECTOR !== 'false',
    trackChanges: process.env.NEXT_PUBLIC_TRACK_LANGUAGE_CHANGES === 'true',
  },

  storageKey: 'ai-whisperers-language',

  locales: {
    en: 'en-US',
    es: 'es-ES',
  } as Record<Language, string>,

  textDirection: {
    en: 'ltr',
    es: 'ltr',
  } as Record<Language, 'ltr' | 'rtl'>,

  dateFormats: {
    en: 'MM/DD/YYYY',
    es: 'DD/MM/YYYY',
  } as Record<Language, string>,
} as const

// Legacy exports for backward compatibility
export const DEFAULT_LANGUAGE = i18nConfig.defaultLanguage
export const FALLBACK_LANGUAGE = i18nConfig.fallbackLanguage
export const SUPPORTED_LANGUAGES = LANGUAGES

/**
 * Validate if a value is a supported Language
 */
export function isValidLanguage(lang: unknown): lang is Language {
  return (
    typeof lang === 'string' &&
    i18nConfig.supportedLanguages.includes(lang as Language)
  )
}

/**
 * Check if a language is enabled via feature flags
 */
export function isLanguageEnabled(lang: Language): boolean {
  if (lang === 'en') return true
  if (lang === 'es') return i18nConfig.features.spanish
  return false
}

/**
 * Get BCP 47 locale code for a language
 */
export function getLocale(lang: Language): string {
  return i18nConfig.locales[lang] || i18nConfig.locales[i18nConfig.defaultLanguage]
}

/**
 * Get text direction for a language
 */
export function getTextDirection(lang: Language): 'ltr' | 'rtl' {
  return i18nConfig.textDirection[lang] || 'ltr'
}

/**
 * Get date format pattern for a language
 */
export function getDateFormat(lang: Language): string {
  return i18nConfig.dateFormats[lang] || i18nConfig.dateFormats[i18nConfig.defaultLanguage]
}

/**
 * Detect browser language preference
 */
export function detectBrowserLanguage(): Language {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return i18nConfig.defaultLanguage
  }

  const browserLanguages = navigator.languages || [navigator.language]

  for (const browserLang of browserLanguages) {
    const langCode = browserLang.split('-')[0].toLowerCase() as Language
    if (isValidLanguage(langCode) && isLanguageEnabled(langCode)) {
      return langCode
    }
  }

  return i18nConfig.defaultLanguage
}

export type LanguageSource = 'url' | 'localStorage' | 'browser' | 'default'

export interface LanguageChangeEvent {
  from: Language
  to: Language
  source: LanguageSource
  timestamp: number
}

// Translation files
export const translations = {
  en: {
    // Navigation
    nav: {
      home: 'Home',
      courses: 'Courses',
      services: 'Services',
      solutions: 'Solutions',
      about: 'About',
      blog: 'Blog',
      contact: 'Contact',
      dashboard: 'Dashboard',
      signIn: 'Sign In',
      signOut: 'Sign Out'
    },
    // Courses
    courses: {
      title: 'AI Courses',
      subtitle: 'Master AI with comprehensive courses from beginner to expert',
      enrollButton: 'Enroll Now',
      viewDetails: 'View Details',
      duration: 'Duration',
      difficulty: 'Difficulty',
      price: 'Price',
      free: 'Free',
      featured: 'Featured',
      learningObjectives: 'What you\'ll learn',
      prerequisites: 'Prerequisites',
      allCourses: 'All Courses',
      beginner: 'Beginner',
      intermediate: 'Intermediate', 
      advanced: 'Advanced',
      expert: 'Expert',
      noCourses: 'No courses found',
      noCoursesDescription: 'No courses match your current filters.'
    },
    // Authentication
    auth: {
      signIn: 'Sign In',
      signUp: 'Sign Up',
      signOut: 'Sign Out',
      email: 'Email',
      password: 'Password',
      welcomeBack: 'Welcome back',
      createAccount: 'Create your account',
      continueWithGoogle: 'Continue with Google',
      continueWithGitHub: 'Continue with GitHub',
      sendMagicLink: 'Send magic link',
      checkEmail: 'Check your email',
      magicLinkSent: 'We\'ve sent a magic link to your email',
      backToSignIn: 'Back to sign in',
      noAccount: 'Don\'t have an account?',
      haveAccount: 'Already have an account?',
      emailVerificationRequired: 'Email Verification Required',
      verifyEmailMessage: 'Please verify your email address to access this content.'
    },
    // Common
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      close: 'Close',
      ok: 'OK',
      yes: 'Yes',
      no: 'No'
    },
    // Landing page
    landing: {
      heroTitle: 'Master AI with World-Class Education',
      heroSubtitle: 'From beginner to expert - comprehensive AI courses for everyone',
      getStarted: 'Get Started',
      learnMore: 'Learn More',
      featuredCourses: 'Featured Courses',
      whyChooseUs: 'Why Choose AI Whisperers?',
      comprehensiveCurriculum: 'Comprehensive Curriculum',
      expertInstructors: 'Expert Instructors',
      practicalProjects: 'Practical Projects',
      communitySupport: 'Community Support'
    }
  },
  es: {
    nav: {
      home: 'Inicio',
      courses: 'Cursos',
      services: 'Servicios',
      solutions: 'Soluciones',
      about: 'Acerca de',
      blog: 'Blog',
      contact: 'Contacto',
      dashboard: 'Panel',
      signIn: 'Iniciar Sesión',
      signOut: 'Cerrar Sesión'
    },
    courses: {
      title: 'Cursos de IA',
      subtitle: 'Domina la IA con cursos integrales desde principiante hasta experto',
      enrollButton: 'Inscribirse Ahora',
      viewDetails: 'Ver Detalles',
      duration: 'Duración',
      difficulty: 'Dificultad',
      price: 'Precio',
      free: 'Gratis',
      featured: 'Destacado',
      learningObjectives: 'Lo que aprenderás',
      prerequisites: 'Requisitos previos',
      allCourses: 'Todos los Cursos',
      beginner: 'Principiante',
      intermediate: 'Intermedio',
      advanced: 'Avanzado',
      expert: 'Experto',
      noCourses: 'No se encontraron cursos',
      noCoursesDescription: 'No hay cursos que coincidan con tus filtros actuales.'
    },
    auth: {
      signIn: 'Iniciar Sesión',
      signUp: 'Registrarse',
      signOut: 'Cerrar Sesión',
      email: 'Correo electrónico',
      password: 'Contraseña',
      welcomeBack: 'Bienvenido de nuevo',
      createAccount: 'Crea tu cuenta',
      continueWithGoogle: 'Continuar con Google',
      continueWithGitHub: 'Continuar con GitHub',
      sendMagicLink: 'Enviar enlace mágico',
      checkEmail: 'Revisa tu correo',
      magicLinkSent: 'Hemos enviado un enlace mágico a tu correo',
      backToSignIn: 'Volver al inicio de sesión',
      noAccount: '¿No tienes cuenta?',
      haveAccount: '¿Ya tienes cuenta?',
      emailVerificationRequired: 'Verificación de correo requerida',
      verifyEmailMessage: 'Por favor verifica tu dirección de correo para acceder a este contenido.'
    },
    common: {
      loading: 'Cargando...',
      error: 'Error',
      success: 'Éxito',
      save: 'Guardar',
      cancel: 'Cancelar',
      delete: 'Eliminar',
      edit: 'Editar',
      back: 'Atrás',
      next: 'Siguiente',
      previous: 'Anterior',
      close: 'Cerrar',
      ok: 'OK',
      yes: 'Sí',
      no: 'No'
    },
    landing: {
      heroTitle: 'Domina la IA con Educación de Clase Mundial',
      heroSubtitle: 'De principiante a experto - cursos integrales de IA para todos',
      getStarted: 'Comenzar',
      learnMore: 'Aprende Más',
      featuredCourses: 'Cursos Destacados',
      whyChooseUs: '¿Por Qué Elegir AI Whisperers?',
      comprehensiveCurriculum: 'Currículo Integral',
      expertInstructors: 'Instructores Expertos',
      practicalProjects: 'Proyectos Prácticos',
      communitySupport: 'Soporte Comunitario'
    }
  }
  // Note: Portuguese and French translations removed
  // Focus is now exclusively on English and Spanish (EN/ES)
}
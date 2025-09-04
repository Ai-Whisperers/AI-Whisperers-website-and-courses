// Translation Hook
// Custom hook for accessing translations

'use client'

import { useLanguage } from './context'
import { translations } from './config'
import type { Language } from './types'

type TranslationPath = 
  | 'nav.home' | 'nav.courses' | 'nav.about' | 'nav.blog' | 'nav.contact' 
  | 'nav.dashboard' | 'nav.signIn' | 'nav.signOut'
  | 'courses.title' | 'courses.subtitle' | 'courses.enrollButton' | 'courses.viewDetails'
  | 'courses.duration' | 'courses.difficulty' | 'courses.price' | 'courses.free'
  | 'courses.featured' | 'courses.learningObjectives' | 'courses.prerequisites'
  | 'courses.allCourses' | 'courses.beginner' | 'courses.intermediate' 
  | 'courses.advanced' | 'courses.expert' | 'courses.noCourses' | 'courses.noCoursesDescription'
  | 'auth.signIn' | 'auth.signUp' | 'auth.signOut' | 'auth.email' | 'auth.password'
  | 'auth.welcomeBack' | 'auth.createAccount' | 'auth.continueWithGoogle' 
  | 'auth.continueWithGitHub' | 'auth.sendMagicLink' | 'auth.checkEmail'
  | 'auth.magicLinkSent' | 'auth.backToSignIn' | 'auth.noAccount' | 'auth.haveAccount'
  | 'auth.emailVerificationRequired' | 'auth.verifyEmailMessage'
  | 'common.loading' | 'common.error' | 'common.success' | 'common.save'
  | 'common.cancel' | 'common.delete' | 'common.edit' | 'common.back'
  | 'common.next' | 'common.previous' | 'common.close' | 'common.ok'
  | 'common.yes' | 'common.no'
  | 'landing.heroTitle' | 'landing.heroSubtitle' | 'landing.getStarted' 
  | 'landing.learnMore' | 'landing.featuredCourses' | 'landing.whyChooseUs'
  | 'landing.comprehensiveCurriculum' | 'landing.expertInstructors'
  | 'landing.practicalProjects' | 'landing.communitySupport'

export function useTranslation() {
  const { language } = useLanguage()
  
  const t = (key: TranslationPath, fallback?: string): string => {
    const keys = key.split('.')
    let value: any = translations[language as keyof typeof translations]
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        // Fallback to English if translation not found
        let fallbackValue: any = translations.en
        for (const fk of keys) {
          if (fallbackValue && typeof fallbackValue === 'object' && fk in fallbackValue) {
            fallbackValue = fallbackValue[fk]
          } else {
            return fallback || key
          }
        }
        return fallbackValue || fallback || key
      }
    }
    
    return typeof value === 'string' ? value : fallback || key
  }
  
  const formatMessage = (key: TranslationPath, values?: Record<string, string | number>): string => {
    let message = t(key)
    
    if (values) {
      Object.entries(values).forEach(([placeholder, value]) => {
        message = message.replace(new RegExp(`{${placeholder}}`, 'g'), String(value))
      })
    }
    
    return message
  }
  
  return {
    t,
    formatMessage,
    language,
    isLanguageLoaded: language !== undefined
  }
}
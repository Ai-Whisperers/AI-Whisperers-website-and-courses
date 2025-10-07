// Auto-generated content index - Do not edit manually
// Generated from: src/content/pages/*.yml
// Language-aware: Keys include language suffix (e.g., 'homepage-en', 'homepage-es')

import type { PageContent } from '@/types/content';
import { about_esContent } from './about-es';
import { about_enContent } from './about-en';
import { architecture_esContent } from './architecture-es';
import { architecture_enContent } from './architecture-en';
import { contact_esContent } from './contact-es';
import { contact_enContent } from './contact-en';
import { dashboard_esContent } from './dashboard-es';
import { dashboard_enContent } from './dashboard-en';
import { faq_esContent } from './faq-es';
import { faq_enContent } from './faq-en';
import { homepage_esContent } from './homepage-es';
import { homepage_enContent } from './homepage-en';
import { privacy_esContent } from './privacy-es';
import { privacy_enContent } from './privacy-en';
import { services_esContent } from './services-es';
import { services_enContent } from './services-en';
import { solutions_esContent } from './solutions-es';
import { solutions_enContent } from './solutions-en';
import { terms_esContent } from './terms-es';
import { terms_enContent } from './terms-en';

export const contentMap: Record<string, PageContent> = {
  'about-es': about_esContent,
  'about-en': about_enContent,
  'architecture-es': architecture_esContent,
  'architecture-en': architecture_enContent,
  'contact-es': contact_esContent,
  'contact-en': contact_enContent,
  'dashboard-es': dashboard_esContent,
  'dashboard-en': dashboard_enContent,
  'faq-es': faq_esContent,
  'faq-en': faq_enContent,
  'homepage-es': homepage_esContent,
  'homepage-en': homepage_enContent,
  'privacy-es': privacy_esContent,
  'privacy-en': privacy_enContent,
  'services-es': services_esContent,
  'services-en': services_enContent,
  'solutions-es': solutions_esContent,
  'solutions-en': solutions_enContent,
  'terms-es': terms_esContent,
  'terms-en': terms_enContent,
} as const;

/**
 * Get compiled page content by full key (includes language)
 * @param fullKey - Page key with language (e.g., 'homepage-en', 'homepage-es')
 */
export function getCompiledPageContent(fullKey: string): PageContent | null {
  return contentMap[fullKey] || null;
}

/**
 * Get compiled page content with language fallback
 * @param pageName - Base page name (e.g., 'homepage')
 * @param language - Language code (e.g., 'en', 'es')
 */
export function getCompiledPageContentWithLang(
  pageName: string,
  language: string = 'en'
): PageContent | null {
  const key = `${pageName}-${language}`;
  return contentMap[key] || contentMap[`${pageName}-en`] || null;
}

// Individual content exports
export { default as about_esContent } from './about-es';
export { default as about_enContent } from './about-en';
export { default as architecture_esContent } from './architecture-es';
export { default as architecture_enContent } from './architecture-en';
export { default as contact_esContent } from './contact-es';
export { default as contact_enContent } from './contact-en';
export { default as dashboard_esContent } from './dashboard-es';
export { default as dashboard_enContent } from './dashboard-en';
export { default as faq_esContent } from './faq-es';
export { default as faq_enContent } from './faq-en';
export { default as homepage_esContent } from './homepage-es';
export { default as homepage_enContent } from './homepage-en';
export { default as privacy_esContent } from './privacy-es';
export { default as privacy_enContent } from './privacy-en';
export { default as services_esContent } from './services-es';
export { default as services_enContent } from './services-en';
export { default as solutions_esContent } from './solutions-es';
export { default as solutions_enContent } from './solutions-en';
export { default as terms_esContent } from './terms-es';
export { default as terms_enContent } from './terms-en';

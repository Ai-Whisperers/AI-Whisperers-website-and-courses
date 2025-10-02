// Auto-generated content index - Do not edit manually
// Generated from: src/content/pages/*.yml

import type { PageContent } from '@/types/content';
import { aboutContent } from './about';
import { architectureContent } from './architecture';
import { contactContent } from './contact';
import { faqContent } from './faq';
import { homepageContent } from './homepage';
import { privacyContent } from './privacy';
import { servicesContent } from './services';
import { solutionsContent } from './solutions';
import { termsContent } from './terms';

export const contentMap: Record<string, PageContent> = {
  'about': aboutContent,
  'architecture': architectureContent,
  'contact': contactContent,
  'faq': faqContent,
  'homepage': homepageContent,
  'privacy': privacyContent,
  'services': servicesContent,
  'solutions': solutionsContent,
  'terms': termsContent,
} as const;

export function getCompiledPageContent(pageName: string): PageContent | null {
  return contentMap[pageName] || null;
}

// Individual content exports
export { default as aboutContent } from './about';
export { default as architectureContent } from './architecture';
export { default as contactContent } from './contact';
export { default as faqContent } from './faq';
export { default as homepageContent } from './homepage';
export { default as privacyContent } from './privacy';
export { default as servicesContent } from './services';
export { default as solutionsContent } from './solutions';
export { default as termsContent } from './terms';

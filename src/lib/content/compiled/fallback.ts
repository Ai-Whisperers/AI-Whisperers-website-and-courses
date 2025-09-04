// Auto-generated fallback content - Do not edit manually

import type { PageContent } from '@/types/content';

export function getFallbackPageContent(pageName: string): PageContent {
  return {
    meta: {
      title: `${pageName.charAt(0).toUpperCase() + pageName.slice(1)} - AI Whisperers`,
      description: 'AI education and consulting services',
      keywords: ['AI', 'education', 'courses'],
      language: 'en'
    },
    navigation: {
      brand: { text: 'AI Whisperers' },
      items: [
        { text: 'Home', href: '/' },
        { text: 'Courses', href: '/courses' },
        { text: 'Services', href: '/services' },
        { text: 'About', href: '/about' },
        { text: 'Contact', href: '/contact' }
      ],
      cta: { text: 'Get Started', variant: 'default' }
    },
    hero: {
      title: 'Content Loading...',
      subtitle: 'Please wait while we load the page content',
      description: 'This page is currently loading. If you continue to see this message, there may be an issue with content loading.',
      cta: {
        primary: 'Go Home',
        secondary: 'Contact Support'
      }
    },
    features: {
      differentiators: {
        title: 'Features',
        description: 'Loading content...',
        items: []
      },
      services: {
        title: 'Services',
        description: 'Loading content...',
        departments: [],
        goalStatement: 'Loading content...'
      },
      tools: {
        title: 'Tools',
        items: []
      }
    },
    stats: {
      title: 'Statistics',
      description: 'Loading content...',
      metrics: []
    },
    contact: {
      title: 'Contact',
      description: 'Get in touch with us',
      primaryCta: { text: 'Contact', variant: 'default' },
      secondaryCta: { text: 'Email', variant: 'outline' },
      info: []
    },
    footer: {
      brand: { text: 'AI Whisperers' },
      copyright: '© 2025 AI Whisperers. All rights reserved.'
    }
  } as const;
}

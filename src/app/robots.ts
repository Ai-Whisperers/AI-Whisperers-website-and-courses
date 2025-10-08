/**
 * Robots.txt Configuration for AI Whisperers
 * Controls search engine crawler access and blocks AI scrapers
 */

import { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://aiwhisperers.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/courses',
          '/courses/*',
          '/services',
          '/solutions',
          '/about',
          '/contact',
          '/blog',
          '/blog/*',
          '/faq',
          '/terms',
          '/privacy',
        ],
        disallow: [
          '/api/*',
          '/dashboard',
          '/dashboard/*',
          '/admin',
          '/admin/*',
          '/auth/*',
          '/_next/*',
          '/architecture', // Dev-only route
        ],
      },
      // Block AI crawlers and scrapers
      {
        userAgent: 'GPTBot',
        disallow: ['/'],
      },
      {
        userAgent: 'ChatGPT-User',
        disallow: ['/'],
      },
      {
        userAgent: 'CCBot',
        disallow: ['/'],
      },
      {
        userAgent: 'anthropic-ai',
        disallow: ['/'],
      },
      {
        userAgent: 'Claude-Web',
        disallow: ['/'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}
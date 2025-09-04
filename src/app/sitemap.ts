import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://aiparaguay.com'
  const currentDate = new Date().toISOString()

  // Core pages
  const corePages = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/servicios`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/sobre-nosotros`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contacto`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
  ]

  // Department solution pages
  const departmentPages = [
    'ejecutivos',
    'ventas', 
    'finanzas',
    'rrhh',
    'operaciones',
    'atencion-cliente'
  ].map(dept => ({
    url: `${baseUrl}/solutions/${dept}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // Case study pages
  const caseStudyPages = [
    'manufacturas-globales-sa',
    'techcorp-paraguay',
    'servicios-financieros-sa'
  ].map(caseStudy => ({
    url: `${baseUrl}/case-studies/${caseStudy}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // Team member pages
  const teamPages = [
    'ivan-weiss-van-der-pol',
    'kiryan-weiss-van-der-pol'
  ].map(member => ({
    url: `${baseUrl}/team/${member}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  // Additional pages
  const additionalPages = [
    {
      url: `${baseUrl}/resources`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    }
  ]

  return [
    ...corePages,
    ...departmentPages,
    ...caseStudyPages,
    ...teamPages,
    ...additionalPages
  ]
}
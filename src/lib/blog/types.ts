export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: {
    name: string
    avatar?: string
    bio?: string
  }
  publishedAt: string
  updatedAt?: string
  tags: string[]
  category: string
  featuredImage?: string
  readTime: number
  source?: {
    name: string
    url: string
    originalPublishedAt: string
  }
  seo: {
    metaTitle: string
    metaDescription: string
    keywords: string[]
  }
}

export interface BlogCategory {
  id: string
  name: string
  slug: string
  description: string
  color: string
  icon: string
}

export interface BlogSource {
  id: string
  name: string
  url: string
  rssUrl?: string
  description: string
  logo?: string
  isActive: boolean
  lastFetched?: string
}

export interface BlogFilters {
  category?: string
  tag?: string
  author?: string
  search?: string
  dateRange?: {
    from: string
    to: string
  }
}
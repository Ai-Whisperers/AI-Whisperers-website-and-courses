import { BlogPost, BlogFilters, BlogCategory } from './types'
import { SAMPLE_BLOG_POSTS, BLOG_CATEGORIES } from './data'
import { AI_NEWS_SOURCES } from './sources'

// Simulated API for blog operations
// In a real implementation, this would connect to a CMS or external APIs

export class BlogAPI {
  private static posts: BlogPost[] = SAMPLE_BLOG_POSTS
  private static categories: BlogCategory[] = BLOG_CATEGORIES

  // Get all blog posts with optional filtering
  static async getPosts(filters: BlogFilters = {}, limit?: number): Promise<BlogPost[]> {
    let filteredPosts = [...this.posts]

    // Apply filters
    if (filters.category) {
      filteredPosts = filteredPosts.filter(post => post.category === filters.category)
    }

    if (filters.tag) {
      filteredPosts = filteredPosts.filter(post => 
        post.tags.some(tag => tag.toLowerCase().includes(filters.tag!.toLowerCase()))
      )
    }

    if (filters.author) {
      filteredPosts = filteredPosts.filter(post => 
        post.author.name.toLowerCase().includes(filters.author!.toLowerCase())
      )
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filteredPosts = filteredPosts.filter(post => 
        post.title.toLowerCase().includes(searchTerm) ||
        post.excerpt.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(searchTerm) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      )
    }

    if (filters.dateRange) {
      filteredPosts = filteredPosts.filter(post => {
        const postDate = new Date(post.publishedAt)
        const fromDate = new Date(filters.dateRange!.from)
        const toDate = new Date(filters.dateRange!.to)
        return postDate >= fromDate && postDate <= toDate
      })
    }

    // Sort by publication date (newest first)
    filteredPosts.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )

    // Apply limit if specified
    if (limit) {
      filteredPosts = filteredPosts.slice(0, limit)
    }

    return filteredPosts
  }

  // Get a single blog post by slug
  static async getPostBySlug(slug: string): Promise<BlogPost | null> {
    const post = this.posts.find(p => p.slug === slug)
    return post || null
  }

  // Get featured posts
  static async getFeaturedPosts(limit: number = 3): Promise<BlogPost[]> {
    return this.posts
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, limit)
  }

  // Get related posts
  static async getRelatedPosts(postId: string, limit: number = 3): Promise<BlogPost[]> {
    const currentPost = this.posts.find(p => p.id === postId)
    if (!currentPost) return []

    // Find posts with similar tags or category
    const relatedPosts = this.posts
      .filter(p => p.id !== postId)
      .map(post => {
        let score = 0
        
        // Same category gets higher score
        if (post.category === currentPost.category) {
          score += 5
        }
        
        // Shared tags increase score
        const sharedTags = post.tags.filter(tag => 
          currentPost.tags.includes(tag)
        ).length
        score += sharedTags * 2

        return { post, score }
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.post)

    return relatedPosts
  }

  // Get all categories
  static async getCategories(): Promise<BlogCategory[]> {
    return this.categories
  }

  // Get posts by category
  static async getPostsByCategory(categorySlug: string, limit?: number): Promise<BlogPost[]> {
    return this.getPosts({ category: categorySlug }, limit)
  }

  // Get all unique tags
  static async getTags(): Promise<string[]> {
    const allTags = this.posts.flatMap(post => post.tags)
    return [...new Set(allTags)].sort()
  }

  // Search posts
  static async searchPosts(query: string, limit?: number): Promise<BlogPost[]> {
    return this.getPosts({ search: query }, limit)
  }

  // Get post count by category
  static async getPostCountByCategory(): Promise<Record<string, number>> {
    const counts: Record<string, number> = {}
    
    this.categories.forEach(category => {
      counts[category.slug] = this.posts.filter(post => post.category === category.slug).length
    })
    
    return counts
  }

  // Get recent posts
  static async getRecentPosts(limit: number = 5): Promise<BlogPost[]> {
    return this.posts
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, limit)
  }

  // Get popular tags
  static async getPopularTags(limit: number = 10): Promise<{ tag: string; count: number }[]> {
    const tagCounts: Record<string, number> = {}
    
    this.posts.forEach(post => {
      post.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      })
    })
    
    return Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
  }
}

// External content fetching (for future implementation)
export class ExternalContentFetcher {
  // Fetch content from RSS feeds
  static async fetchFromRSS(rssUrl: string): Promise<Partial<BlogPost>[]> {
    // This would implement RSS parsing in a real application
    // For now, return empty array
    console.log(`Would fetch from RSS: ${rssUrl}`)
    return []
  }

  // Fetch content from specific sources
  static async fetchFromSource(sourceId: string): Promise<Partial<BlogPost>[]> {
    const source = AI_NEWS_SOURCES.find(s => s.id === sourceId)
    if (!source || !source.isActive) {
      return []
    }

    // This would implement source-specific fetching
    console.log(`Would fetch from source: ${source.name}`)
    return []
  }

  // Aggregate content from all sources
  static async aggregateFromAllSources(): Promise<Partial<BlogPost>[]> {
    const allContent: Partial<BlogPost>[] = []

    for (const source of AI_NEWS_SOURCES) {
      if (source.isActive && source.rssUrl) {
        const content = await this.fetchFromRSS(source.rssUrl)
        allContent.push(...content)
      }
    }

    return allContent
  }
}

// Blog analytics (for future implementation)
export class BlogAnalytics {
  static async getPostViews(postId: string): Promise<number> {
    // This would integrate with analytics service
    return Math.floor(Math.random() * 1000) + 100
  }

  static async getPopularPosts(timeframe: 'week' | 'month' | 'year' = 'month'): Promise<BlogPost[]> {
    // This would return posts sorted by popularity metrics
    return BlogAPI.getFeaturedPosts(5)
  }

  static async trackPostView(postId: string): Promise<void> {
    // This would track page views
    console.log(`Tracking view for post: ${postId}`)
  }
}
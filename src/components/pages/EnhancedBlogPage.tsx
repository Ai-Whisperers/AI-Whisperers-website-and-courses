'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { DynamicIcon } from '@/components/content/DynamicIcon'
import { DynamicButton } from '@/components/content/DynamicButton'
import { LanguageToggler } from '@/components/ui/LanguageToggler'
import { NewsletterSignup } from '@/components/interactive/NewsletterSignup'
import { BlogAPI } from '@/lib/blog/api'
import { BlogPost, BlogCategory, BlogFilters } from '@/lib/blog/types'
import type { PageContent } from '@/types/content'

interface BlogPageProps {
  content: PageContent
}

export function EnhancedBlogPage({ content }: BlogPageProps) {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [popularTags, setPopularTags] = useState<{ tag: string; count: number }[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<BlogFilters>({})
  const [searchQuery, setSearchQuery] = useState('')

  const { navigation, hero, footer } = content

  useEffect(() => {
    loadBlogData()
  }, [filters])

  const loadBlogData = async () => {
    setIsLoading(true)
    try {
      const [postsData, categoriesData, tagsData] = await Promise.all([
        BlogAPI.getPosts(filters),
        BlogAPI.getCategories(),
        BlogAPI.getPopularTags(8)
      ])
      
      setPosts(postsData)
      setCategories(categoriesData)
      setPopularTags(tagsData)
    } catch (error) {
      console.error('Error loading blog data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setFilters({ ...filters, search: searchQuery })
  }

  const handleCategoryFilter = (categorySlug: string) => {
    setFilters({ 
      ...filters, 
      category: filters.category === categorySlug ? undefined : categorySlug 
    })
  }

  const handleTagFilter = (tag: string) => {
    setFilters({ 
      ...filters, 
      tag: filters.tag === tag ? undefined : tag 
    })
  }

  const clearFilters = () => {
    setFilters({})
    setSearchQuery('')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return '1 day ago'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return `${Math.floor(diffDays / 30)} months ago`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <DynamicIcon name="Brain" className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">{navigation.brand.text}</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              {navigation.items.map((item, index: number) => (
                <a 
                  key={index}
                  href={item.href} 
                  className={`transition-colors ${
                    item.href === '/blog' 
                      ? 'text-blue-600 font-medium' 
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  {item.text}
                </a>
              ))}
              <LanguageToggler />
              <DynamicButton 
                content={{
                  ...navigation.cta,
                  variant: 'default'
                }}
                className="bg-blue-600 hover:bg-blue-700"
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              {hero.headline}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
              {hero.subheadline}
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search AI articles, tutorials, and insights..."
                  className="w-full px-6 py-4 text-lg border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-14"
                />
                <DynamicIcon 
                  name="Search" 
                  className="absolute left-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" 
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Category Pills */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {categories.slice(0, 6).map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryFilter(category.slug)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    filters.category === category.slug
                      ? `${category.color} text-white shadow-lg scale-105`
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <DynamicIcon name={category.icon} className="h-4 w-4 mr-1.5 inline" />
                  {category.name}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Quick Stats */}
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h3 className="font-semibold text-gray-900 mb-4">Content Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Articles</span>
                    <span className="font-semibold text-blue-600">{posts.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Categories</span>
                    <span className="font-semibold text-blue-600">{categories.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Popular Tags</span>
                    <span className="font-semibold text-blue-600">{popularTags.length}</span>
                  </div>
                </div>
              </div>

              {/* Active Filters */}
              {(filters.category || filters.tag || filters.search) && (
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Active Filters</h3>
                    <button
                      onClick={clearFilters}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="space-y-2">
                    {filters.category && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                        Category: {categories.find(c => c.slug === filters.category)?.name}
                        <button
                          onClick={() => handleCategoryFilter(filters.category!)}
                          className="ml-2 hover:text-blue-600"
                        >
                          <DynamicIcon name="X" className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                    {filters.tag && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                        Tag: {filters.tag}
                        <button
                          onClick={() => handleTagFilter(filters.tag!)}
                          className="ml-2 hover:text-green-600"
                        >
                          <DynamicIcon name="X" className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                    {filters.search && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                        Search: {filters.search}
                        <button
                          onClick={() => setFilters({ ...filters, search: undefined })}
                          className="ml-2 hover:text-purple-600"
                        >
                          <DynamicIcon name="X" className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Newsletter Signup */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
                <h3 className="font-semibold text-gray-900 mb-2">Weekly AI Insights</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Get curated AI news and business insights delivered weekly.
                </p>
                <NewsletterSignup variant="sidebar" />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="space-y-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white rounded-lg p-6 shadow-sm border animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12">
                <DynamicIcon name="Search" className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No articles found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search criteria or browse all categories.
                </p>
                <button
                  onClick={clearFilters}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear filters and show all articles
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Results header */}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Showing {posts.length} article{posts.length !== 1 ? 's' : ''}
                    {filters.category && ` in ${categories.find(c => c.slug === filters.category)?.name}`}
                    {filters.search && ` matching "${filters.search}"`}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Sort by:</span>
                    <select className="text-sm border border-gray-300 rounded px-2 py-1">
                      <option>Newest first</option>
                      <option>Most popular</option>
                      <option>Most relevant</option>
                    </select>
                  </div>
                </div>

                {/* Featured Post */}
                {posts.length > 0 && !Object.keys(filters).some(key => filters[key as keyof BlogFilters]) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden border"
                  >
                    <div className="grid md:grid-cols-2 gap-0">
                      <div className="relative order-2 md:order-1">
                        <img
                          src={posts[0].featuredImage}
                          alt={posts[0].title}
                          className="w-full h-64 md:h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/images/blog-placeholder.jpg'
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      </div>
                      
                      <div className="p-8 order-1 md:order-2">
                        <div className="flex items-center mb-4">
                          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-medium px-3 py-1 rounded-full mr-3">
                            Featured Article
                          </span>
                          <span className="text-sm text-gray-500">
                            {getTimeAgo(posts[0].publishedAt)}
                          </span>
                        </div>
                        
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                          <a 
                            href={`/blog/${posts[0].slug}`}
                            className="hover:text-blue-600 transition-colors"
                          >
                            {posts[0].title}
                          </a>
                        </h2>
                        
                        <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                          {posts[0].excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center">
                            <img
                              src={posts[0].author.avatar}
                              alt={posts[0].author.name}
                              className="w-10 h-10 rounded-full mr-3 ring-2 ring-blue-100"
                              onError={(e) => {
                                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(posts[0].author.name)}&background=3b82f6&color=ffffff&size=40`
                              }}
                            />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {posts[0].author.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {posts[0].readTime} min read • {formatDate(posts[0].publishedAt)}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-6">
                          {posts[0].tags.slice(0, 3).map((tag) => (
                            <button
                              key={tag}
                              onClick={() => handleTagFilter(tag)}
                              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm rounded-full transition-colors"
                            >
                              {tag}
                            </button>
                          ))}
                        </div>

                        <a
                          href={`/blog/${posts[0].slug}`}
                          className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                          Read Full Article
                          <DynamicIcon name="ArrowRight" className="h-4 w-4 ml-2" />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Article Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {posts.slice(Object.keys(filters).some(key => filters[key as keyof BlogFilters]) ? 0 : 1).map((post, index) => (
                    <motion.article
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-lg transition-all duration-300 group"
                    >
                      <div className="relative overflow-hidden">
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.src = '/images/blog-placeholder.jpg'
                          }}
                        />
                        <div className="absolute top-4 left-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium text-white ${
                            categories.find(c => c.slug === post.category)?.color || 'bg-gray-500'
                          }`}>
                            {categories.find(c => c.slug === post.category)?.name || post.category}
                          </span>
                        </div>
                        {post.source && (
                          <div className="absolute top-4 right-4">
                            <span className="bg-black/70 text-white px-2 py-1 rounded text-xs">
                              {post.source.name}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <span>{formatDate(post.publishedAt)}</span>
                          <span className="mx-2">•</span>
                          <span>{post.readTime} min read</span>
                        </div>
                        
                        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          <a 
                            href={`/blog/${post.slug}`}
                            className="hover:text-blue-600 transition-colors"
                          >
                            {post.title}
                          </a>
                        </h3>
                        
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex flex-wrap gap-1 mb-4">
                          {post.tags.slice(0, 2).map((tag) => (
                            <button
                              key={tag}
                              onClick={() => handleTagFilter(tag)}
                              className="px-2 py-1 bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-700 text-xs rounded transition-colors"
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <img
                              src={post.author.avatar}
                              alt={post.author.name}
                              className="w-6 h-6 rounded-full mr-2"
                              onError={(e) => {
                                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author.name)}&background=3b82f6&color=ffffff&size=24`
                              }}
                            />
                            <span className="text-sm text-gray-700">{post.author.name}</span>
                          </div>
                          
                          <a
                            href={`/blog/${post.slug}`}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center group-hover:translate-x-1 transition-transform"
                          >
                            Read more
                            <DynamicIcon name="ArrowRight" className="h-4 w-4 ml-1" />
                          </a>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>

                {/* Load More Button */}
                {posts.length >= 10 && (
                  <div className="text-center">
                    <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                      Load More Articles
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <DynamicIcon name="Brain" className="h-6 w-6 text-blue-400" />
              <span className="text-lg font-bold">{footer.brand.text}</span>
            </div>
            <div className="text-sm text-gray-400">
              © 2025 AI Paraguay. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
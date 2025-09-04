'use client'

import { motion } from "framer-motion"
import { DynamicIcon } from "@/components/content/DynamicIcon"
import { DynamicButton } from "@/components/content/DynamicButton"
import { LanguageToggler } from "@/components/ui/LanguageToggler"
import { TestimonialsCarousel } from "@/components/interactive/TestimonialsCarousel"
import type { PageContent, Navigation, Footer } from "@/types/content"

interface TestimonialsPageProps {
  content: PageContent
}

interface CaseStudy {
  id: string
  title: string
  summary: string
  industry: string
  size: string
  challenge: string
  solution: string
  results: {
    metric: string
    before: string
    after: string
    improvement: string
  }[]
}

interface TestimonialsContent {
  navigation: Navigation
  hero: {
    headline: string
    subheadline: string
    description: string
  }
  stats: {
    title: string
    description: string
    metrics: {
      value: string
      label: string
    }[]
  }
  testimonials: {
    title: string
    description: string
  }
  caseStudies: {
    title: string
    description: string
    studies: CaseStudy[]
  }
  videoTestimonials: {
    title: string
    description: string
    videos: {
      id: string
      title: string
      thumbnail: string
      videoUrl: string
      duration: string
    }[]
  }
  industries: {
    title: string
    description: string
    sectors: {
      name: string
      count: number
      highlight: string
    }[]
  }
  cta: {
    title: string
    description: string
    primary: { text: string; href: string }
    secondary: { text: string; href: string }
  }
  footer: Footer
}

export function TestimonialsPage({ content }: TestimonialsPageProps) {
  const testimonialsContent = content as unknown as TestimonialsContent
  const { navigation, hero, stats, testimonials, caseStudies, videoTestimonials, industries, cta, footer } = testimonialsContent

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
                    item.href === '/testimonials' 
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
        <div className="max-w-7xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              {hero.headline}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-4 max-w-4xl mx-auto">
              {hero.subheadline}
            </p>
            <p className="text-lg text-gray-500 mb-12 max-w-3xl mx-auto">
              {hero.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold mb-4">{stats.title}</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              {stats.description}
            </p>
          
            <div className="grid md:grid-cols-4 gap-8">
              {stats.metrics.map((metric, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="text-4xl font-bold text-blue-200 mb-2">{metric.value}</div>
                  <p className="text-blue-100">{metric.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{testimonials.title}</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {testimonials.description}
            </p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <TestimonialsCarousel />
          </motion.div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{caseStudies.title}</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {caseStudies.description}
            </p>
          </div>

          <div className="space-y-12">
            {caseStudies.studies.map((study, index) => (
              <motion.div
                key={study.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="bg-white rounded-xl shadow-lg p-8"
              >
                <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                    <div className="flex items-center mb-4">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
                        {study.industry}
                      </span>
                      <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {study.size}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{study.title}</h3>
                    <p className="text-lg text-gray-600 mb-6">{study.summary}</p>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900">Challenge</h4>
                        <p className="text-gray-600">{study.challenge}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Solution</h4>
                        <p className="text-gray-600">{study.solution}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <DynamicIcon name="TrendingUp" className="h-5 w-5 text-green-600 mr-2" />
                      Results & Impact
                    </h4>
                    
                    <div className="space-y-4">
                      {study.results.map((result, resultIndex) => (
                        <div key={resultIndex} className="border-l-4 border-blue-500 pl-4">
                          <div className="font-medium text-gray-900">{result.metric}</div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <span>{result.before}</span>
                            <DynamicIcon name="ArrowRight" className="h-4 w-4" />
                            <span>{result.after}</span>
                          </div>
                          <div className="text-lg font-bold text-green-600">{result.improvement}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{videoTestimonials.title}</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {videoTestimonials.description}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {videoTestimonials.videos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative bg-gray-900 rounded-lg overflow-hidden group cursor-pointer"
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.src = '/images/video-placeholder.jpg'
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <DynamicIcon name="Play" className="h-8 w-8 text-gray-900 ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                  <h3 className="text-white font-semibold">{video.title}</h3>
                  <p className="text-gray-300 text-sm">{video.duration}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{industries.title}</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {industries.description}
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {industries.sectors.map((sector, index) => (
              <motion.div
                key={sector.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-lg p-6 text-center shadow-sm border"
              >
                <div className="text-3xl font-bold text-blue-600 mb-2">{sector.count}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{sector.name}</h3>
                <p className="text-sm text-gray-600">{sector.highlight}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              {cta.title}
            </h2>
            <p className="text-lg text-blue-100 mb-8">
              {cta.description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <DynamicButton 
                content={cta.primary}
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-medium"
              />
              <DynamicButton 
                content={cta.secondary}
                className="text-white border-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <DynamicIcon name="Brain" className="h-6 w-6 text-blue-400" />
              <span className="text-lg font-bold">{footer.brand.text}</span>
            </div>
            <div className="text-sm text-gray-400">
              {footer.copyright}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
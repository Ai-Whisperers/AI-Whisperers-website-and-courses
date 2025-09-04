'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { DynamicIcon } from '@/components/content/DynamicIcon'

interface Testimonial {
  id: string
  name: string
  position: string
  company: string
  message: string
  photo: string
  companyLogo: string
  rating: number
  metrics?: {
    label: string
    value: string
  }[]
  videoUrl?: string
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Carlos Mendoza',
    position: 'CEO',
    company: 'TechCorp Paraguay',
    message: 'AI Paraguay transformed our sales process completely. Our team now generates 150% more qualified leads and closes deals 40% faster. The ROI was evident within the first month.',
    photo: '/images/testimonials/carlos-mendoza.jpg',
    companyLogo: '/images/companies/techcorp-logo.png',
    rating: 5,
    metrics: [
      { label: 'Lead Generation Increase', value: '150%' },
      { label: 'Deal Closure Speed', value: '40% faster' },
      { label: 'ROI Realization', value: '1 month' }
    ]
  },
  {
    id: '2',
    name: 'María Rodriguez',
    position: 'CFO',
    company: 'Servicios Financieros SA',
    message: 'The financial reporting automation reduced our monthly closing time from 3 days to 4 hours. Our accounting team can now focus on strategic analysis instead of manual data entry.',
    photo: '/images/testimonials/maria-rodriguez.jpg',
    companyLogo: '/images/companies/servicios-financieros-logo.png',
    rating: 5,
    metrics: [
      { label: 'Report Generation Time', value: '94% reduction' },
      { label: 'Error Rate', value: '99% decrease' },
      { label: 'Team Productivity', value: '300% increase' }
    ]
  },
  {
    id: '3',
    name: 'Diego Villalba',
    position: 'Operations Director',
    company: 'Manufacturas Globales SA',
    message: 'AI implementation streamlined our entire supply chain. Inventory management is now predictive, and we\'ve eliminated 85% of manual procurement processes.',
    photo: '/images/testimonials/diego-villalba.jpg',
    companyLogo: '/images/companies/manufacturas-logo.png',
    rating: 5,
    metrics: [
      { label: 'Inventory Accuracy', value: '99.2%' },
      { label: 'Manual Processes Eliminated', value: '85%' },
      { label: 'Cost Savings', value: '$125K annually' }
    ]
  },
  {
    id: '4',
    name: 'Ana Silva',
    position: 'HR Director',
    company: 'Grupo Empresarial PY',
    message: 'The HR automation tools revolutionized our recruitment process. We now screen candidates 10x faster and have improved our hiring accuracy by 65%.',
    photo: '/images/testimonials/ana-silva.jpg',
    companyLogo: '/images/companies/grupo-py-logo.png',
    rating: 5,
    metrics: [
      { label: 'Screening Speed', value: '10x faster' },
      { label: 'Hiring Accuracy', value: '65% improvement' },
      { label: 'Time to Hire', value: '50% reduction' }
    ]
  }
]

export function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000) // Resume auto-play after 10 seconds
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="p-8"
          >
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Left Side - Content */}
              <div>
                {/* Rating */}
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <DynamicIcon
                      key={i}
                      name="Star"
                      className={`h-5 w-5 ${
                        i < currentTestimonial.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {currentTestimonial.rating}.0
                  </span>
                </div>

                {/* Message */}
                <blockquote className="text-lg text-gray-700 mb-6">
                  &ldquo;{currentTestimonial.message}&rdquo;
                </blockquote>

                {/* Author Info */}
                <div className="flex items-center mb-6">
                  <div className="relative">
                    <Image
                      src={currentTestimonial.photo}
                      alt={currentTestimonial.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full object-cover border-2 border-blue-200"
                      onError={(e) => {
                        // Fallback to avatar
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentTestimonial.name)}&background=3b82f6&color=ffffff&size=48`
                      }}
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold text-gray-900">
                      {currentTestimonial.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {currentTestimonial.position} at {currentTestimonial.company}
                    </div>
                  </div>
                  <Image
                    src={currentTestimonial.companyLogo}
                    alt={`${currentTestimonial.company} logo`}
                    width={64}
                    height={32}
                    className="ml-auto h-8 w-auto opacity-60"
                    onError={(e) => {
                      // Hide if logo doesn't exist
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>

                {/* Video Testimonial Button */}
                {currentTestimonial.videoUrl && (
                  <button className="flex items-center text-blue-600 hover:text-blue-700 transition-colors">
                    <DynamicIcon name="Play" className="h-5 w-5 mr-2" />
                    <span className="text-sm font-medium">Watch video testimonial</span>
                  </button>
                )}
              </div>

              {/* Right Side - Metrics */}
              {currentTestimonial.metrics && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <DynamicIcon name="BarChart3" className="h-5 w-5 text-blue-600 mr-2" />
                    Impact Metrics
                  </h4>
                  <div className="space-y-4">
                    {currentTestimonial.metrics.map((metric, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm text-gray-600">{metric.label}</span>
                        <span className="font-bold text-lg text-blue-600">
                          {metric.value}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <DynamicIcon name="ChevronLeft" className="h-5 w-5 text-gray-600" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <DynamicIcon name="ChevronRight" className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center space-x-2 p-4 bg-gray-50">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-blue-600 w-8'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-gray-200">
        <motion.div
          className="h-full bg-blue-600"
          initial={{ width: '0%' }}
          animate={{ width: isAutoPlaying ? '100%' : '0%' }}
          transition={{ duration: 5, ease: "linear" }}
          key={currentIndex}
        />
      </div>
    </div>
  )
}
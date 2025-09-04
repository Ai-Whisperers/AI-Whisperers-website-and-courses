'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { DynamicIcon } from '@/components/content/DynamicIcon'

interface NewsletterSignupProps {
  variant?: 'inline' | 'modal' | 'sidebar'
  leadMagnet?: {
    title: string
    description: string
    downloadUrl: string
    previewImage?: string
  }
}

export function NewsletterSignup({ 
  variant = 'inline',
  leadMagnet = {
    title: 'Ultimate AI Implementation Checklist',
    description: 'A comprehensive 25-page guide with step-by-step instructions, templates, and best practices for implementing AI in your business.',
    downloadUrl: '/downloads/ai-implementation-checklist.pdf',
    previewImage: '/images/checklist-preview.png'
  }
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Here you would typically call your newsletter service API
      // const response = await fetch('/api/newsletter/subscribe', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, name, company })
      // })

      setIsSuccess(true)
      
      // Trigger download
      if (leadMagnet.downloadUrl) {
        const link = document.createElement('a')
        link.href = leadMagnet.downloadUrl
        link.download = 'ai-implementation-checklist.pdf'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    } catch (err) {
      setError('Failed to subscribe. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-green-50 border border-green-200 rounded-lg p-6 text-center"
      >
        <DynamicIcon name="CheckCircle" className="h-12 w-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-green-900 mb-2">
          Welcome to AI Paraguay!
        </h3>
        <p className="text-green-700 mb-4">
          Your download should start automatically. Check your email for exclusive AI insights!
        </p>
        <button
          onClick={() => {
            setIsSuccess(false)
            setEmail('')
            setName('')
            setCompany('')
          }}
          className="text-green-600 hover:text-green-700 text-sm font-medium"
        >
          Subscribe another email
        </button>
      </motion.div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
      <div className="grid lg:grid-cols-2 gap-6 items-center">
        {/* Lead Magnet Preview */}
        <div>
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-16 h-20 bg-white rounded-lg shadow-md flex items-center justify-center border">
                <DynamicIcon name="FileText" className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">
                FREE: {leadMagnet.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {leadMagnet.description}
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <DynamicIcon name="Check" className="h-4 w-4 text-green-600 mr-2" />
              Step-by-step implementation guide
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <DynamicIcon name="Check" className="h-4 w-4 text-green-600 mr-2" />
              ROI calculation templates
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <DynamicIcon name="Check" className="h-4 w-4 text-green-600 mr-2" />
              Department-specific AI tools recommendations
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <DynamicIcon name="Check" className="h-4 w-4 text-green-600 mr-2" />
              Weekly AI industry insights
            </div>
          </div>
        </div>

        {/* Signup Form */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="your.email@company.com"
              />
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                Company (Optional)
              </label>
              <input
                type="text"
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your company name"
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm flex items-center">
                <DynamicIcon name="AlertCircle" className="h-4 w-4 mr-2" />
                {error}
              </div>
            )}

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Subscribing...
                </>
              ) : (
                <>
                  <DynamicIcon name="Download" className="h-4 w-4 mr-2" />
                  Get Free Checklist + Weekly Insights
                </>
              )}
            </motion.button>

            <p className="text-xs text-gray-500 text-center">
              No spam, ever. Unsubscribe with one click. We respect your privacy.
            </p>
          </form>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="mt-6 pt-4 border-t border-blue-200">
        <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
          <div className="flex items-center">
            <DynamicIcon name="Users" className="h-4 w-4 mr-1" />
            2,500+ subscribers
          </div>
          <div className="flex items-center">
            <DynamicIcon name="Shield" className="h-4 w-4 mr-1" />
            GDPR compliant
          </div>
          <div className="flex items-center">
            <DynamicIcon name="Star" className="h-4 w-4 mr-1 text-yellow-400" />
            4.9/5 rating
          </div>
        </div>
      </div>
    </div>
  )
}
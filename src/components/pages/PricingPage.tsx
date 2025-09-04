'use client'

import { motion } from "framer-motion"
import { DynamicIcon } from "@/components/content/DynamicIcon"
import { DynamicButton } from "@/components/content/DynamicButton"
import { LanguageToggler } from "@/components/ui/LanguageToggler"
import { PricingCalculator } from "@/components/interactive/PricingCalculator"
import type { PageContent, Navigation, Footer } from "@/types/content"

interface PricingPageProps {
  content: PageContent
}

interface PricingContent {
  navigation: Navigation
  hero: {
    headline: string
    subheadline: string
    description: string
  }
  calculator: {
    title: string
    description: string
  }
  features: {
    title: string
    items: {
      icon: string
      title: string
      description: string
    }[]
  }
  packages: {
    title: string
    description: string
    items: {
      name: string
      price: string
      description: string
      features: string[]
      popular: boolean
    }[]
  }
  testimonials: {
    title: string
    items: {
      company: string
      result: string
      quote: string
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

export function PricingPage({ content }: PricingPageProps) {
  const pricingContent = content as unknown as PricingContent
  const { navigation, hero, calculator, features, packages, testimonials, cta, footer } = pricingContent

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
                    item.href === '/pricing' 
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

      {/* Interactive Calculator */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{calculator.title}</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {calculator.description}
            </p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <PricingCalculator />
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{features.title}</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.items.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-sm border text-center"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <DynamicIcon name={feature.icon} className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pre-built Packages */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{packages.title}</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {packages.description}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {packages.items.map((pkg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`bg-white rounded-xl shadow-lg border-2 p-8 relative ${
                  pkg.popular ? 'border-blue-500 scale-105' : 'border-gray-200'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                  <div className="text-3xl font-bold text-blue-600 mb-4">{pkg.price}</div>
                  <p className="text-gray-600 mb-6">{pkg.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm">
                      <DynamicIcon name="Check" className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                    pkg.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Get Started
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Testimonials */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{testimonials.title}</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.items.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center"
              >
                <div className="text-2xl font-bold text-blue-200 mb-2">
                  {testimonial.result}
                </div>
                <div className="font-semibold mb-2">{testimonial.company}</div>
                <p className="text-blue-100 text-sm">&ldquo;{testimonial.quote}&rdquo;</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {cta.title}
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              {cta.description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <DynamicButton 
                content={cta.primary}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-medium"
              />
              <DynamicButton 
                content={cta.secondary}
                className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 text-lg"
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
'use client'

import { motion } from "framer-motion"
import { DynamicIcon } from "@/components/content/DynamicIcon"
import { DynamicButton } from "@/components/content/DynamicButton"
import type { PageContent } from "@/types/content"

interface ServicesPageProps {
  content: PageContent
}

export function ServicesPage({ content }: ServicesPageProps) {
  const { navigation, hero, mainServices, departmentServices, tools, process, pricing, testimonials, contact, footer } = content

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
              {navigation.items.map((item, index) => (
                <a 
                  key={index}
                  href={item.href} 
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {item.text}
                </a>
              ))}
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

      {/* Main Services */}
      {mainServices && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{mainServices.title}</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {mainServices.description}
              </p>
            </div>

          <div className="grid md:grid-cols-2 gap-8">
            {mainServices.services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white border rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <DynamicIcon name={service.icon} className="h-8 w-8 text-blue-600 mr-3" />
                  <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                </div>
                <p className="text-gray-600 mb-6">{service.description}</p>
                
                <div className="space-y-2 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center">
                      <DynamicIcon name="Check" className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  <span>Duración: {service.duration}</span>
                  <span className="font-semibold text-blue-600">{service.price}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Department Services */}
      {departmentServices && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{departmentServices.title}</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {departmentServices.description}
              </p>
            </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departmentServices.departments.map((department, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-sm"
              >
                <div className="flex items-center mb-4">
                  <DynamicIcon name={department.icon} className="h-6 w-6 text-blue-600 mr-3" />
                  <h3 className="font-semibold text-gray-900">{department.title}</h3>
                </div>
                <ul className="space-y-2">
                  {department.services.map((service, serviceIndex) => (
                    <li key={serviceIndex} className="text-sm text-gray-600 flex items-center">
                      <DynamicIcon name="ArrowRight" className="h-3 w-3 text-blue-500 mr-2" />
                      {service}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Tools */}
      {tools && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{tools.title}</h2>
              <p className="text-lg text-gray-600">{tools.description}</p>
            </div>

          <div className="space-y-12">
            {tools.categories.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">{category.title}</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {category.tools.map((tool, toolIndex) => (
                    <div key={toolIndex} className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">{tool.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{tool.description}</p>
                      <p className="text-xs text-blue-600">{tool.useCase}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Process */}
      {process && (
        <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{process.title}</h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                {process.description}
              </p>
            </div>

          <div className="grid md:grid-cols-5 gap-8">
            {process.steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">{step.number}</span>
                </div>
                <h3 className="font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-blue-100 mb-2">{step.description}</p>
                <p className="text-xs text-blue-200">{step.duration}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Pricing */}
      {pricing && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{pricing.title}</h2>
              <p className="text-lg text-gray-600">{pricing.description}</p>
            </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricing.plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`bg-white rounded-lg p-8 shadow-sm border-2 ${
                  plan.popular ? 'border-blue-500 relative' : 'border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-1 text-sm rounded-full">
                      Más Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="text-3xl font-bold text-blue-600 mb-1">{plan.price}</div>
                  <p className="text-gray-500 text-sm">{plan.period}</p>
                  <p className="text-gray-600 mt-2">{plan.description}</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <DynamicIcon name="Check" className="h-4 w-4 text-green-500 mr-3" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <DynamicButton 
                  content={plan.cta}
                  className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'border border-blue-600 text-blue-600 hover:bg-blue-50'}`}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Testimonials */}
      {testimonials && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{testimonials.title}</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.items.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gray-50 p-6 rounded-lg"
                >
                  <p className="text-gray-600 mb-4 italic">&ldquo;{testimonial.quote}&rdquo;</p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.author}</p>
                    <p className="text-sm text-gray-500">{testimonial.position}</p>
                    <p className="text-sm text-blue-600">{testimonial.company}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact CTA */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {contact.title}
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            {contact.description}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <DynamicButton 
              content={contact.primaryCta}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
            />
            <DynamicButton 
              content={contact.secondaryCta}
              className="px-8 py-3 text-lg"
            />
          </div>
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
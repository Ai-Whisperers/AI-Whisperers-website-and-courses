'use client'

import { motion } from "framer-motion"
import { DynamicIcon } from "@/components/content/DynamicIcon"
import { DynamicButton } from "@/components/content/DynamicButton"
import type { PageContent } from "@/types/content"

interface ContactPageProps {
  content: PageContent
}

export function ContactPage({ content }: ContactPageProps) {
  const { navigation, hero, contactOptions, officeInfo, consultationForm, faq, socialProof, footer } = content

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

      {/* Contact Options */}
      {contactOptions && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{contactOptions.title}</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {contactOptions.description}
              </p>
            </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactOptions.options.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`bg-white border-2 rounded-lg p-6 text-center transition-all hover:shadow-md ${
                  option.primaryMethod ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <DynamicIcon name={option.icon} className={`h-12 w-12 mx-auto mb-4 ${
                  option.primaryMethod ? 'text-blue-600' : 'text-gray-600'
                }`} />
                <h3 className="font-semibold text-gray-900 mb-2">{option.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{option.description}</p>
                <p className="font-medium text-gray-900 mb-4">{option.value}</p>
                <a
                  href={option.action.href}
                  target={option.action.external ? "_blank" : undefined}
                  rel={option.action.external ? "noopener noreferrer" : undefined}
                  className={`inline-block px-4 py-2 rounded text-sm font-medium transition-colors ${
                    option.primaryMethod 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.action.text}
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Office Info & Form */}
      {officeInfo && consultationForm && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Office Information */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-6">{officeInfo.title}</h2>
                <p className="text-lg text-gray-600 mb-8">{officeInfo.description}</p>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Dirección</h3>
                  <p className="text-gray-600">
                    {officeInfo.address.street}<br />
                    {officeInfo.address.neighborhood}<br />
                    {officeInfo.address.city}, {officeInfo.address.country}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Horarios de Atención</h3>
                  <p className="text-gray-600">
                    {officeInfo.workingHours.weekdays}<br />
                    {officeInfo.workingHours.saturday}<br />
                    {officeInfo.workingHours.sunday}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Consultation Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white rounded-lg p-8 shadow-sm"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{consultationForm.title}</h2>
              <p className="text-gray-600 mb-6">{consultationForm.description}</p>
              
              <form className="space-y-4">
                {consultationForm.fields.map((field, index) => (
                  <div key={index}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {field.type === 'select' ? (
                      <select 
                        name={field.name}
                        required={field.required}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Seleccionar...</option>
                        {field.options?.map((option, optionIndex) => (
                          <option key={optionIndex} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : field.type === 'textarea' ? (
                      <textarea
                        name={field.name}
                        placeholder={field.placeholder}
                        required={field.required}
                        rows={field.rows || 3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <input
                        type={field.type}
                        name={field.name}
                        placeholder={field.placeholder}
                        required={field.required}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    )}
                  </div>
                ))}
                
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
                >
                  {consultationForm.submitButton.text}
                </button>
              </form>
              
              <p className="text-xs text-gray-500 mt-4">
                {consultationForm.privacyNote}
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      )}

      {/* FAQ */}
      {faq && (
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{faq.title}</h2>
            </div>

          <div className="space-y-6">
            {faq.items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 rounded-lg p-6"
              >
                <h3 className="font-semibold text-gray-900 mb-2">{item.question}</h3>
                <p className="text-gray-600">{item.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Social Proof */}
      {socialProof && (
        <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{socialProof.title}</h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                {socialProof.description}
              </p>
            </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {socialProof.stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-blue-200 mb-2">{stat.value}</div>
                <p className="text-blue-100">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {socialProof.testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-blue-500/30 p-6 rounded-lg backdrop-blur-sm"
              >
                <p className="text-blue-100 mb-4 italic">&ldquo;{testimonial.quote}&rdquo;</p>
                <div>
                  <p className="font-semibold text-white">{testimonial.author}</p>
                  <p className="text-blue-200">{testimonial.company}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      )}

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
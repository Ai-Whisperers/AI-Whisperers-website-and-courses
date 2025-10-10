'use client'

import { motion } from "framer-motion"
import { DynamicIcon } from "@/components/content/DynamicIcon"
import { DynamicButton } from "@/components/content/DynamicButton"
import type { PageContent } from "@/types/content"

interface ContactPageProps {
  content: PageContent
}

export function ContactPage({ content }: ContactPageProps) {
  const { hero, contactOptions, officeInfo, consultationForm, faq, socialProof } = content

  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              {hero.headline}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-4xl mx-auto">
              {hero.subheadline}
            </p>
            <p className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto">
              {hero.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Options */}
      {contactOptions && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">{contactOptions.title}</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
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
                className={`glass-card text-center ${
                  option.primaryMethod ? 'border-2 border-foreground/30' : ''
                }`}
              >
                <DynamicIcon name={option.icon} className={`h-12 w-12 mx-auto mb-4 ${
                  option.primaryMethod ? 'text-primary' : 'text-muted-foreground'
                }`} />
                <h3 className="font-semibold text-foreground mb-2">{option.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{option.description}</p>
                <p className="font-medium text-foreground mb-4">{option.value}</p>
                <a
                  href={option.action.href}
                  target={option.action.external ? "_blank" : undefined}
                  rel={option.action.external ? "noopener noreferrer" : undefined}
                  className="glass-button inline-block px-4 py-2 text-sm"
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
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Office Information */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-3xl font-bold text-foreground mb-6">{officeInfo.title}</h2>
                <p className="text-lg text-muted-foreground mb-8">{officeInfo.description}</p>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Dirección</h3>
                  <p className="text-muted-foreground">
                    {officeInfo.address.street}<br />
                    {officeInfo.address.neighborhood}<br />
                    {officeInfo.address.city}, {officeInfo.address.country}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Horarios de Atención</h3>
                  <p className="text-muted-foreground">
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
              className="bg-card rounded-lg p-8 shadow-sm"
            >
              <h2 className="text-2xl font-bold text-foreground mb-4">{consultationForm.title}</h2>
              <p className="text-muted-foreground mb-6">{consultationForm.description}</p>
              
              <form className="space-y-4">
                {consultationForm.fields.map((field, index) => (
                  <div key={index}>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {field.type === 'select' ? (
                      <select 
                        name={field.name}
                        required={field.required}
                        className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
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
                        className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    ) : (
                      <input
                        type={field.type}
                        name={field.name}
                        placeholder={field.placeholder}
                        required={field.required}
                        className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    )}
                  </div>
                ))}
                
                <button
                  type="submit"
                  className="w-full bg-primary text-white py-3 px-4 rounded-md hover:bg-primary/90 transition-colors font-medium"
                >
                  {consultationForm.submitButton.text}
                </button>
              </form>
              
              <p className="text-xs text-muted-foreground mt-4">
                {consultationForm.privacyNote}
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      )}

      {/* FAQ */}
      {faq && (
        <section className="py-16 bg-card">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">{faq.title}</h2>
            </div>

          <div className="space-y-6">
            {faq.items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-muted rounded-lg p-6"
              >
                <h3 className="font-semibold text-foreground mb-2">{item.question}</h3>
                <p className="text-muted-foreground">{item.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Social Proof */}
      {socialProof && (
        <section className="py-16 glass relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{socialProof.title}</h2>
              <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto">
                {socialProof.description}
              </p>
            </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {socialProof.stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-primary-foreground/90 mb-2">{stat.value}</div>
                <p className="text-primary-foreground/80">{stat.label}</p>
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
                className="bg-primary/30 p-6 rounded-lg backdrop-blur-sm"
              >
                <p className="text-primary-foreground/80 mb-4 italic">&ldquo;{testimonial.quote}&rdquo;</p>
                <div>
                  <p className="font-semibold text-primary-foreground">{testimonial.author}</p>
                  <p className="text-primary-foreground/90">{testimonial.company}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      )}
    </div>
  )
}
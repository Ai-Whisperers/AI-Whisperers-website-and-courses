'use client'

import { motion } from "framer-motion"
import { DynamicIcon } from "@/components/content/DynamicIcon"
import { DynamicButton } from "@/components/content/DynamicButton"
import type { PageContent } from "@/types/content"

interface ServicesPageProps {
  content: PageContent
}

export function ServicesPage({ content }: ServicesPageProps) {
  const { hero, mainServices, departmentServices, tools, process, pricing, testimonials, contact } = content

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg-primary)' }}>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>
              {hero.headline}
            </h1>
            <p className="text-xl md:text-2xl mb-4 max-w-4xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
              {hero.subheadline}
            </p>
            <p className="text-lg mb-12 max-w-3xl mx-auto" style={{ color: 'var(--color-text-tertiary)' }}>
              {hero.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Services */}
      {mainServices && (
        <section className="py-16" style={{ background: 'var(--color-bg-primary)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>{mainServices.title}</h2>
              <p className="text-lg max-w-3xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
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
                className="border rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow"
                style={{
                  background: 'var(--color-surface-base)',
                  borderColor: 'var(--color-border-default)'
                }}
              >
                <div className="flex items-center mb-4">
                  <DynamicIcon name={service.icon} className="h-8 w-8 mr-3" style={{ color: 'var(--color-primary-600)' }} />
                  <h3 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{service.title}</h3>
                </div>
                <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>{service.description}</p>

                <div className="space-y-2 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center">
                      <DynamicIcon name="Check" className="h-4 w-4 mr-2" style={{ color: 'var(--color-success)' }} />
                      <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center text-sm mb-4" style={{ color: 'var(--color-text-tertiary)' }}>
                  <span>Duración: {service.duration}</span>
                  <span className="font-semibold" style={{ color: 'var(--color-primary-600)' }}>{service.price}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Department Services */}
      {departmentServices && (
        <section className="py-16" style={{ background: 'var(--color-bg-secondary)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>{departmentServices.title}</h2>
              <p className="text-lg max-w-3xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
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
                className="p-6 rounded-lg shadow-sm"
                style={{ background: 'var(--color-surface-base)' }}
              >
                <div className="flex items-center mb-4">
                  <DynamicIcon name={department.icon} className="h-6 w-6 mr-3" style={{ color: 'var(--color-primary-600)' }} />
                  <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{department.title}</h3>
                </div>
                <ul className="space-y-2">
                  {department.services.map((service, serviceIndex) => (
                    <li key={serviceIndex} className="text-sm flex items-center" style={{ color: 'var(--color-text-secondary)' }}>
                      <DynamicIcon name="ArrowRight" className="h-3 w-3 mr-2" style={{ color: 'var(--color-primary-500)' }} />
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
        <section className="py-16" style={{ background: 'var(--color-bg-primary)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>{tools.title}</h2>
              <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>{tools.description}</p>
            </div>

          <div className="space-y-12">
            {tools.categories.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h3 className="text-2xl font-bold mb-6 text-center" style={{ color: 'var(--color-text-primary)' }}>{category.title}</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {category.tools.map((tool, toolIndex) => (
                    <div key={toolIndex} className="p-6 rounded-lg" style={{ background: 'var(--color-surface-raised)' }}>
                      <h4 className="font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>{tool.name}</h4>
                      <p className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>{tool.description}</p>
                      <p className="text-xs" style={{ color: 'var(--color-primary-600)' }}>{tool.useCase}</p>
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
        <section
          className="py-16"
          style={{
            background: `linear-gradient(to right, var(--color-primary-600), var(--color-primary-700))`,
            color: 'var(--color-text-inverse)'
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--color-text-inverse)' }}>{process.title}</h2>
              <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--color-neutral-100)' }}>
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
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: 'var(--color-primary-500)' }}
                >
                  <span className="text-2xl font-bold" style={{ color: 'var(--color-text-inverse)' }}>{step.number}</span>
                </div>
                <h3 className="font-bold mb-2" style={{ color: 'var(--color-text-inverse)' }}>{step.title}</h3>
                <p className="text-sm mb-2" style={{ color: 'var(--color-neutral-100)' }}>{step.description}</p>
                <p className="text-xs" style={{ color: 'var(--color-neutral-200)' }}>{step.duration}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Pricing */}
      {pricing && (
        <section className="py-16" style={{ background: 'var(--color-bg-secondary)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>{pricing.title}</h2>
              <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>{pricing.description}</p>
            </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricing.plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-lg p-8 shadow-sm border-2 relative"
                style={{
                  background: 'var(--color-surface-base)',
                  borderColor: plan.popular ? 'var(--color-primary-500)' : 'var(--color-border-default)'
                }}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="px-4 py-1 text-sm rounded-full text-white" style={{ background: 'var(--color-primary-500)' }}>
                      Más Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>{plan.name}</h3>
                  <div className="text-3xl font-bold mb-1" style={{ color: 'var(--color-primary-600)' }}>{plan.price}</div>
                  <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>{plan.period}</p>
                  <p className="mt-2" style={{ color: 'var(--color-text-secondary)' }}>{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <DynamicIcon name="Check" className="h-4 w-4 mr-3" style={{ color: 'var(--color-success)' }} />
                      <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <DynamicButton
                  content={plan.cta}
                  className="w-full"
                  style={{
                    background: plan.popular ? 'var(--color-primary-600)' : 'transparent',
                    border: plan.popular ? 'none' : '1px solid var(--color-primary-600)',
                    color: plan.popular ? 'var(--color-text-inverse)' : 'var(--color-primary-600)'
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Testimonials */}
      {testimonials && (
        <section className="py-16" style={{ background: 'var(--color-bg-primary)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>{testimonials.title}</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.items.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-6 rounded-lg"
                  style={{ background: 'var(--color-surface-raised)' }}
                >
                  <p className="mb-4 italic" style={{ color: 'var(--color-text-secondary)' }}>&ldquo;{testimonial.quote}&rdquo;</p>
                  <div>
                    <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{testimonial.author}</p>
                    <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>{testimonial.position}</p>
                    <p className="text-sm" style={{ color: 'var(--color-primary-600)' }}>{testimonial.company}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact CTA */}
      {contact && (
        <section className="py-16" style={{ background: 'var(--color-bg-secondary)' }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
              {contact.title}
            </h2>
            <p className="text-lg mb-8" style={{ color: 'var(--color-text-secondary)' }}>
              {contact.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <DynamicButton
                content={contact.primaryCta}
                className="px-8 py-3 text-lg text-white"
                style={{ background: 'var(--color-primary-600)' }}
              />
              <DynamicButton
                content={contact.secondaryCta}
                className="px-8 py-3 text-lg border"
                style={{ borderColor: 'var(--color-border-default)', color: 'var(--color-text-primary)' }}
              />
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
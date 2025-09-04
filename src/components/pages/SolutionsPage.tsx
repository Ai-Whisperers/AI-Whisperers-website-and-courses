'use client'

import { useEffect, useState } from 'react'
import { motion } from "framer-motion"
import { DynamicIcon } from "@/components/content/DynamicIcon"
import { DynamicButton } from "@/components/content/DynamicButton"
import { LanguageToggler } from "@/components/ui/LanguageToggler"

interface Solution {
  title: string
  description: string
  features: string[]
  tools: string[]
  implementationTime: string
  price: string
  caseStudy?: {
    company: string
    challenge: string
    solution: string
    results: string[]
  }
}

interface DepartmentData {
  name: string
  icon: string
  color: string
  description: string
  challenges: string[]
  solutions: Solution[]
}

interface SolutionsPageProps {
  department: string
}

export function SolutionsPage({ department }: SolutionsPageProps) {
  const [departmentData, setDepartmentData] = useState<DepartmentData | null>(null)

  useEffect(() => {
    // Load department-specific data based on the department parameter
    const departmentSolutions: Record<string, DepartmentData> = {
      'ejecutivos': {
        name: 'Ejecutivos',
        icon: 'Briefcase',
        color: 'bg-blue-500',
        description: 'Soluciones de IA para la toma de decisiones estratégicas y síntesis ejecutiva',
        challenges: [
          'Sobrecarga de información para decisiones estratégicas',
          'Falta de síntesis rápida de datos complejos',
          'Necesidad de reportes ejecutivos automatizados',
          'Análisis de tendencias de mercado en tiempo real'
        ],
        solutions: [
          {
            title: 'Dashboard Ejecutivo con IA',
            description: 'Panel de control inteligente que analiza datos de múltiples fuentes y genera insights automáticos',
            features: [
              'Análisis automático de KPIs',
              'Alertas inteligentes de anomalías',
              'Resúmenes ejecutivos diarios',
              'Predicciones de tendencias'
            ],
            tools: ['ChatGPT', 'Claude', 'Power BI', 'Tableau'],
            implementationTime: '4-6 semanas',
            price: 'Desde $8,000',
            caseStudy: {
              company: 'TechCorp Paraguay',
              challenge: 'CEO necesitaba síntesis diaria de 50+ métricas de negocio',
              solution: 'Dashboard IA que genera resúmenes automáticos cada mañana',
              results: [
                '90% menos tiempo en revisión de métricas',
                'Detección temprana de 3 problemas críticos',
                'Decisiones 40% más rápidas'
              ]
            }
          },
          {
            title: 'Asistente de Decisiones Estratégicas',
            description: 'IA que analiza propuestas, contratos y documentos estratégicos para acelerar la toma de decisiones',
            features: [
              'Análisis de contratos y propuestas',
              'Identificación de riesgos automática',
              'Comparación de escenarios',
              'Recomendaciones basadas en datos'
            ],
            tools: ['Claude', 'ChatGPT', 'Custom MCPs'],
            implementationTime: '6-8 semanas',
            price: 'Desde $12,000'
          },
          {
            title: 'Sistema de Reportes Inteligentes',
            description: 'Generación automática de reportes ejecutivos personalizados con insights y recomendaciones',
            features: [
              'Reportes automáticos semanales/mensuales',
              'Análisis de performance vs objetivos',
              'Identificación de oportunidades',
              'Benchmarking con industria'
            ],
            tools: ['ChatGPT', 'Power BI', 'Excel', 'Google Sheets'],
            implementationTime: '3-4 semanas',
            price: 'Desde $5,000'
          }
        ]
      },
      'ventas': {
        name: 'Equipos de Ventas',
        icon: 'TrendingUp',
        color: 'bg-green-500',
        description: 'Automatización inteligente para prospección, propuestas y seguimiento de ventas',
        challenges: [
          'Investigación manual de prospectos consume mucho tiempo',
          'Personalización de propuestas repetitiva',
          'Seguimiento inconsistente de leads',
          'Análisis de comportamiento de clientes limitado'
        ],
        solutions: [
          {
            title: 'Prospección Inteligente',
            description: 'IA que investiga prospectos automáticamente y prepara información personalizada para cada contacto',
            features: [
              'Investigación automática de empresas',
              'Análisis de necesidades por industria',
              'Generación de talking points',
              'Identificación de decision makers'
            ],
            tools: ['ChatGPT', 'Claude', 'LinkedIn Sales Navigator', 'CRM Integration'],
            implementationTime: '3-4 semanas',
            price: 'Desde $4,000'
          },
          {
            title: 'Generador de Propuestas IA',
            description: 'Sistema que crea propuestas comerciales personalizadas basadas en el perfil del cliente',
            features: [
              'Templates inteligentes por industria',
              'Personalización automática',
              'Cálculo dinámico de precios',
              'Generación de casos de uso específicos'
            ],
            tools: ['ChatGPT', 'Claude', 'Word/Google Docs', 'PowerPoint'],
            implementationTime: '4-5 semanas',
            price: 'Desde $6,000'
          },
          {
            title: 'Asistente de Follow-up',
            description: 'IA que programa y personaliza seguimientos automáticos basados en el comportamiento del prospecto',
            features: [
              'Seguimiento automático inteligente',
              'Análisis de engagement',
              'Personalización de mensajes',
              'Optimización de timing'
            ],
            tools: ['ChatGPT', 'Email Marketing Tools', 'CRM', 'WhatsApp Business'],
            implementationTime: '2-3 semanas',
            price: 'Desde $3,500'
          }
        ]
      },
      'finanzas': {
        name: 'Personal de Finanzas',
        icon: 'Calculator',
        color: 'bg-purple-500',
        description: 'Automatización de análisis financiero, reportes y procesamiento de documentos',
        challenges: [
          'Procesamiento manual de facturas y documentos',
          'Generación lenta de reportes financieros',
          'Análisis presupuestario consume mucho tiempo',
          'Detección tardía de anomalías'
        ],
        solutions: [
          {
            title: 'Procesador Inteligente de Facturas',
            description: 'IA que extrae, categoriza y procesa facturas automáticamente',
            features: [
              'OCR inteligente para facturas',
              'Categorización automática',
              'Validación de datos',
              'Integración con sistema contable'
            ],
            tools: ['Claude', 'Azure Document Intelligence', 'Excel', 'SAP/QuickBooks'],
            implementationTime: '4-6 semanas',
            price: 'Desde $7,000'
          },
          {
            title: 'Generador de Reportes Financieros',
            description: 'Sistema que crea reportes financieros automáticos con análisis y recommendations',
            features: [
              'Reportes automáticos mensuales',
              'Análisis de variaciones',
              'Indicadores financieros key',
              'Alertas de anomalías'
            ],
            tools: ['ChatGPT', 'Power BI', 'Excel', 'Python/R'],
            implementationTime: '3-4 semanas',
            price: 'Desde $5,500'
          },
          {
            title: 'Análisis Presupuestario IA',
            description: 'Herramienta que analiza presupuestos vs real y genera insights automáticos',
            features: [
              'Análisis automático de desviaciones',
              'Predicciones de cash flow',
              'Identificación de tendencias',
              'Recomendaciones de optimización'
            ],
            tools: ['Claude', 'Excel', 'Power BI', 'Custom Analytics'],
            implementationTime: '5-7 semanas',
            price: 'Desde $9,000'
          }
        ]
      },
      'rrhh': {
        name: 'Equipos de RRHH',
        icon: 'Users',
        color: 'bg-orange-500',
        description: 'Optimización del reclutamiento, evaluación y gestión de talento humano',
        challenges: [
          'Screening manual de CVs consume mucho tiempo',
          'Inconsistencia en procesos de evaluación',
          'Dificultad para encontrar candidatos ideales',
          'Análisis limitado de employee engagement'
        ],
        solutions: [
          {
            title: 'CV Screening Inteligente',
            description: 'IA que analiza y califica CVs automáticamente según criterios específicos del puesto',
            features: [
              'Análisis automático de CVs',
              'Scoring de candidatos',
              'Extracción de skills clave',
              'Ranking automático'
            ],
            tools: ['Claude', 'ChatGPT', 'Applicant Tracking System', 'Custom ML'],
            implementationTime: '3-4 semanas',
            price: 'Desde $4,500'
          },
          {
            title: 'Generador de Job Descriptions',
            description: 'Sistema que crea descripciones de puesto optimizadas y atractivas automáticamente',
            features: [
              'Templates por industria/rol',
              'Optimización para SEO',
              'Análisis de competitividad',
              'Personalización automática'
            ],
            tools: ['ChatGPT', 'Claude', 'Job Board APIs', 'Market Research'],
            implementationTime: '2-3 semanas',
            price: 'Desde $3,000'
          },
          {
            title: 'Asistente de Entrevistas',
            description: 'IA que genera preguntas personalizadas y analiza respuestas de candidatos',
            features: [
              'Preguntas personalizadas por rol',
              'Análisis de respuestas',
              'Scoring de competencias',
              'Recomendaciones de contratación'
            ],
            tools: ['ChatGPT', 'Claude', 'Video Conferencing', 'Assessment Tools'],
            implementationTime: '4-5 semanas',
            price: 'Desde $6,000'
          }
        ]
      },
      'operaciones': {
        name: 'Operaciones',
        icon: 'Settings',
        color: 'bg-indigo-500',
        description: 'Optimización de procesos, gestión de proveedores y control de calidad',
        challenges: [
          'Procesos manuales ineficientes',
          'Gestión compleja de múltiples proveedores',
          'Control de calidad inconsistente',
          'Optimización de inventarios'
        ],
        solutions: [
          {
            title: 'Optimizador de Procesos IA',
            description: 'Análisis inteligente de procesos operativos para identificar mejoras y automatizaciones',
            features: [
              'Mapeo automático de procesos',
              'Identificación de cuellos de botella',
              'Recomendaciones de mejora',
              'ROI calculator automático'
            ],
            tools: ['Claude', 'Process Mining Tools', 'Automation Platforms', 'Analytics'],
            implementationTime: '6-8 semanas',
            price: 'Desde $10,000'
          },
          {
            title: 'Gestión Inteligente de Proveedores',
            description: 'Sistema IA para evaluación, selección y monitoreo de proveedores',
            features: [
              'Scoring automático de proveedores',
              'Análisis de riesgo',
              'Monitoreo de performance',
              'Negociación asistida por IA'
            ],
            tools: ['ChatGPT', 'Claude', 'Supplier Management', 'Risk Assessment'],
            implementationTime: '5-7 semanas',
            price: 'Desde $8,500'
          },
          {
            title: 'Control de Calidad Automatizado',
            description: 'Herramientas de IA para automatizar inspecciones y mantener estándares de calidad',
            features: [
              'Inspección visual automatizada',
              'Detección de anomalías',
              'Reportes de calidad automáticos',
              'Trending de métricas'
            ],
            tools: ['Computer Vision', 'IoT Sensors', 'Machine Learning', 'Dashboards'],
            implementationTime: '8-12 semanas',
            price: 'Desde $15,000'
          }
        ]
      },
      'atencion-cliente': {
        name: 'Atención al Cliente',
        icon: 'Headphones',
        color: 'bg-red-500',
        description: 'Mejora de la experiencia del cliente con respuestas inteligentes y análisis de satisfacción',
        challenges: [
          'Tiempo de respuesta lento',
          'Inconsistencia en la calidad de respuestas',
          'Dificultad para escalar soporte',
          'Análisis limitado de feedback de clientes'
        ],
        solutions: [
          {
            title: 'Chatbot Inteligente',
            description: 'Asistente de IA que responde consultas comunes y escala casos complejos apropiadamente',
            features: [
              'Respuestas contextuales inteligentes',
              'Escalamiento automático',
              'Integración con base de conocimiento',
              'Aprendizaje continuo'
            ],
            tools: ['ChatGPT', 'Claude', 'WhatsApp Business', 'Webchat', 'Telegram'],
            implementationTime: '4-6 semanas',
            price: 'Desde $6,000'
          },
          {
            title: 'Análisis de Sentimientos',
            description: 'IA que analiza feedback de clientes para identificar tendencias y problemas',
            features: [
              'Análisis automático de reviews',
              'Clasificación de sentimientos',
              'Identificación de temas clave',
              'Alertas de problemas emergentes'
            ],
            tools: ['Claude', 'Text Analytics', 'Survey Tools', 'Social Media APIs'],
            implementationTime: '3-4 semanas',
            price: 'Desde $4,000'
          },
          {
            title: 'Centro de Ayuda Inteligente',
            description: 'Base de conocimiento que se actualiza automáticamente y sugiere mejores respuestas',
            features: [
              'FAQ automáticas',
              'Búsqueda inteligente',
              'Contenido auto-actualizable',
              'Analytics de utilización'
            ],
            tools: ['ChatGPT', 'Claude', 'Knowledge Base', 'Search Engine'],
            implementationTime: '5-6 semanas',
            price: 'Desde $7,500'
          }
        ]
      }
    }

    setDepartmentData(departmentSolutions[department] || null)
  }, [department])

  if (!departmentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Departamento no encontrado</h1>
          <p className="text-gray-600">El departamento solicitado no existe.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <DynamicIcon name="Brain" className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">AI Paraguay</span>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageToggler />
              <DynamicButton 
                content={{
                  text: "Consulta Gratuita",
                  href: "/contacto",
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
            className="text-center mb-12"
          >
            <div className={`w-24 h-24 ${departmentData.color} rounded-3xl flex items-center justify-center mx-auto mb-6`}>
              <DynamicIcon name={departmentData.icon} className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Soluciones IA para {departmentData.name}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
              {departmentData.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Challenges Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Desafíos Comunes</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {departmentData.challenges.map((challenge, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg"
              >
                <DynamicIcon name="AlertCircle" className="h-5 w-5 text-orange-500 mt-1 flex-shrink-0" />
                <p className="text-gray-700">{challenge}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Nuestras Soluciones</h2>
          <div className="space-y-12">
            {departmentData.solutions.map((solution, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200"
              >
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Solution Info */}
                  <div className="lg:col-span-2">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{solution.title}</h3>
                    <p className="text-gray-600 mb-6 text-lg">{solution.description}</p>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Características:</h4>
                        <ul className="space-y-2">
                          {solution.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-center">
                              <DynamicIcon name="Check" className="h-4 w-4 text-green-500 mr-2" />
                              <span className="text-sm text-gray-600">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Herramientas:</h4>
                        <div className="flex flex-wrap gap-2">
                          {solution.tools.map((tool, toolIndex) => (
                            <span 
                              key={toolIndex}
                              className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Pricing & CTA */}
                  <div className="lg:col-span-1">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl">
                      <div className="text-center mb-4">
                        <div className="text-3xl font-bold text-blue-600 mb-1">{solution.price}</div>
                        <p className="text-gray-600 text-sm">Implementación: {solution.implementationTime}</p>
                      </div>
                      
                      <DynamicButton
                        content={{
                          text: "Solicitar Propuesta",
                          href: `/contacto?solution=${encodeURIComponent(solution.title)}`,
                          variant: 'default'
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      />
                      
                      <button className="w-full mt-3 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                        Ver Demo
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Case Study */}
                {solution.caseStudy && (
                  <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
                    <h4 className="font-semibold text-gray-900 mb-3">Caso de Éxito: {solution.caseStudy.company}</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <h5 className="font-medium text-gray-800 mb-1">Desafío:</h5>
                        <p className="text-sm text-gray-600">{solution.caseStudy.challenge}</p>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-800 mb-1">Solución:</h5>
                        <p className="text-sm text-gray-600">{solution.caseStudy.solution}</p>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-800 mb-1">Resultados:</h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {solution.caseStudy.results.map((result, resultIndex) => (
                            <li key={resultIndex} className="flex items-center">
                              <DynamicIcon name="CheckCircle" className="h-3 w-3 text-green-500 mr-1" />
                              {result}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para transformar {departmentData.name}?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Agenda una consulta gratuita para discutir tu situación específica
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <DynamicButton 
              content={{
                text: "Consulta Gratuita",
                href: `/contacto?department=${department}`,
                variant: 'default'
              }}
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg"
            />
            <DynamicButton 
              content={{
                text: "Descargar Caso de Estudio",
                href: `/casos-estudio/${department}.pdf`,
                variant: 'outline'
              }}
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
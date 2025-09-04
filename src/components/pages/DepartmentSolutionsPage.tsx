'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { motion } from "framer-motion"
import { DynamicIcon } from "@/components/content/DynamicIcon"
import { DynamicButton } from "@/components/content/DynamicButton"
import { LanguageToggler } from "@/components/ui/LanguageToggler"

interface DepartmentSolutionsPageProps {
  department: string
}

interface DepartmentContent {
  title: string
  description: string
  icon: string
  color: string
  challenges: string[]
  solutions: {
    title: string
    description: string
    features: string[]
    timeToImplement: string
    pricing: string
  }[]
  caseStudy?: {
    title: string
    company: string
    result: string
    description: string
  }
  tools: {
    name: string
    description: string
    useCase: string
  }[]
}

export function DepartmentSolutionsPage({ department }: DepartmentSolutionsPageProps) {
  const [content, setContent] = useState<DepartmentContent | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Department content mapping
  const departmentContent = useMemo((): Record<string, DepartmentContent> => ({
    'executives': {
      title: 'AI Solutions for Executives',
      description: 'Strategic decision-making and executive synthesis powered by artificial intelligence',
      icon: 'Briefcase',
      color: 'bg-blue-500',
      challenges: [
        'Information overload from multiple departments',
        'Need for quick strategic insights',
        'Complex data synthesis for board presentations',
        'Market trend analysis and competitive intelligence'
      ],
      solutions: [
        {
          title: 'Executive Dashboard AI',
          description: 'Real-time insights aggregated from all company data sources',
          features: [
            'Automated KPI summarization',
            'Trend analysis and forecasting',
            'Risk assessment alerts',
            'Competitive intelligence reports'
          ],
          timeToImplement: '4-6 weeks',
          pricing: 'From $8,000 USD'
        },
        {
          title: 'Strategic Document AI',
          description: 'AI-powered analysis and creation of strategic documents',
          features: [
            'Board presentation automation',
            'Market analysis synthesis',
            'Strategic plan optimization',
            'Stakeholder communication drafts'
          ],
          timeToImplement: '2-3 weeks',
          pricing: 'From $5,000 USD'
        }
      ],
      caseStudy: {
        title: 'CEO Dashboard Implementation',
        company: 'Regional Manufacturing Corp',
        result: '70% reduction in time spent on data analysis',
        description: 'Implemented an AI-powered executive dashboard that aggregates data from 15 different systems, providing real-time insights and automated reports for board meetings.'
      },
      tools: [
        {
          name: 'Claude AI',
          description: 'Advanced document analysis and strategic synthesis',
          useCase: 'Market analysis and competitive intelligence reports'
        },
        {
          name: 'ChatGPT',
          description: 'Executive communication and presentation content',
          useCase: 'Board presentation drafts and stakeholder communications'
        },
        {
          name: 'Custom Analytics Platform',
          description: 'Real-time business intelligence aggregation',
          useCase: 'KPI dashboards and trend analysis'
        }
      ]
    },
    'sales-teams': {
      title: 'AI Solutions for Sales Teams',
      description: 'Boost sales performance with AI-powered prospect research and proposal automation',
      icon: 'TrendingUp',
      color: 'bg-green-500',
      challenges: [
        'Time-consuming prospect research',
        'Inconsistent proposal quality',
        'Manual lead qualification',
        'Follow-up management and timing'
      ],
      solutions: [
        {
          title: 'Smart Prospect Research',
          description: 'AI-powered prospect analysis and personalized outreach strategies',
          features: [
            'Automated company research',
            'Decision-maker identification',
            'Personalized outreach templates',
            'Market timing insights'
          ],
          timeToImplement: '2-3 weeks',
          pricing: 'From $3,000 USD'
        },
        {
          title: 'Proposal Generation AI',
          description: 'Automated proposal creation with industry-specific customization',
          features: [
            'Template optimization',
            'ROI calculation automation',
            'Competitive positioning analysis',
            'Success story integration'
          ],
          timeToImplement: '3-4 weeks',
          pricing: 'From $4,500 USD'
        }
      ],
      caseStudy: {
        title: 'Sales Team Acceleration',
        company: 'TechCorp Paraguay',
        result: '150% increase in qualified leads',
        description: 'Implemented AI-powered prospect research and proposal automation, resulting in more targeted outreach and higher conversion rates.'
      },
      tools: [
        {
          name: 'ChatGPT',
          description: 'Prospect research and personalized messaging',
          useCase: 'Company research and outreach personalization'
        },
        {
          name: 'Claude AI',
          description: 'Proposal writing and competitive analysis',
          useCase: 'RFP responses and sales presentation creation'
        },
        {
          name: 'LinkedIn Sales Navigator AI',
          description: 'Enhanced lead qualification and social selling',
          useCase: 'Prospect identification and engagement tracking'
        }
      ]
    },
    'finance-staff': {
      title: 'AI Solutions for Finance Teams',
      description: 'Automate financial analysis, reporting, and budget management with AI',
      icon: 'Calculator',
      color: 'bg-purple-500',
      challenges: [
        'Manual report generation and consolidation',
        'Complex budget analysis and forecasting',
        'Invoice processing and expense management',
        'Financial compliance and audit preparation'
      ],
      solutions: [
        {
          title: 'Automated Financial Reporting',
          description: 'AI-powered financial analysis and report generation',
          features: [
            'Multi-source data consolidation',
            'Variance analysis automation',
            'Trend identification and alerts',
            'Executive summary generation'
          ],
          timeToImplement: '4-6 weeks',
          pricing: 'From $6,000 USD'
        },
        {
          title: 'Budget Intelligence System',
          description: 'Smart budgeting with predictive analytics',
          features: [
            'Automated budget vs actual analysis',
            'Expense categorization',
            'Cash flow forecasting',
            'Department spending insights'
          ],
          timeToImplement: '3-5 weeks',
          pricing: 'From $5,500 USD'
        }
      ],
      caseStudy: {
        title: 'Financial Reporting Automation',
        company: 'Servicios Financieros SA',
        result: '80% reduction in report generation time',
        description: 'Automated monthly financial reporting process, reducing manual work from 3 days to 4 hours while improving accuracy and consistency.'
      },
      tools: [
        {
          name: 'Claude AI',
          description: 'Financial document analysis and report writing',
          useCase: 'Monthly reports and variance analysis explanations'
        },
        {
          name: 'Excel AI Integration',
          description: 'Advanced spreadsheet automation and analysis',
          useCase: 'Budget modeling and financial forecasting'
        },
        {
          name: 'Custom Analytics Dashboard',
          description: 'Real-time financial KPI monitoring',
          useCase: 'Cash flow tracking and expense analysis'
        }
      ]
    },
    'hr-teams': {
      title: 'AI Solutions for HR Teams',
      description: 'Transform recruitment, employee analytics, and HR processes with AI',
      icon: 'Users',
      color: 'bg-orange-500',
      challenges: [
        'Time-intensive CV screening and candidate evaluation',
        'Inconsistent interview processes',
        'Employee performance analysis complexity',
        'Manual onboarding and training coordination'
      ],
      solutions: [
        {
          title: 'Smart Recruitment System',
          description: 'AI-powered CV screening and candidate matching',
          features: [
            'Automated CV analysis and ranking',
            'Skills matching algorithms',
            'Interview question generation',
            'Candidate experience optimization'
          ],
          timeToImplement: '3-4 weeks',
          pricing: 'From $4,000 USD'
        },
        {
          title: 'Employee Analytics Platform',
          description: 'Data-driven insights for employee development and retention',
          features: [
            'Performance trend analysis',
            'Retention risk prediction',
            'Training needs assessment',
            'Team dynamics insights'
          ],
          timeToImplement: '4-6 weeks',
          pricing: 'From $6,500 USD'
        }
      ],
      caseStudy: {
        title: 'Recruitment Process Optimization',
        company: 'TechCorp Paraguay',
        result: '90% reduction in CV screening time',
        description: 'Implemented AI-powered CV analysis system that processes and ranks candidates automatically, reducing time-to-hire from 4 weeks to 1.5 weeks.'
      },
      tools: [
        {
          name: 'Claude AI',
          description: 'CV analysis and candidate evaluation',
          useCase: 'Resume screening and interview question generation'
        },
        {
          name: 'ChatGPT',
          description: 'Job description optimization and candidate communication',
          useCase: 'Improved job postings and interview scheduling'
        },
        {
          name: 'HR Analytics Platform',
          description: 'Employee data analysis and insights',
          useCase: 'Performance tracking and retention analysis'
        }
      ]
    },
    'operations': {
      title: 'AI Solutions for Operations',
      description: 'Optimize processes, supply chain management, and operational efficiency with AI',
      icon: 'Settings',
      color: 'bg-indigo-500',
      challenges: [
        'Complex supply chain coordination',
        'Manual process optimization',
        'Inventory management inefficiencies',
        'Quality control and compliance tracking'
      ],
      solutions: [
        {
          title: 'Supply Chain Intelligence',
          description: 'AI-powered supply chain optimization and risk management',
          features: [
            'Demand forecasting automation',
            'Supplier performance analysis',
            'Risk assessment and mitigation',
            'Cost optimization recommendations'
          ],
          timeToImplement: '6-8 weeks',
          pricing: 'From $8,500 USD'
        },
        {
          title: 'Process Optimization AI',
          description: 'Intelligent process analysis and improvement recommendations',
          features: [
            'Workflow bottleneck identification',
            'Efficiency metric tracking',
            'Automation opportunity analysis',
            'Performance optimization suggestions'
          ],
          timeToImplement: '4-6 weeks',
          pricing: 'From $6,000 USD'
        }
      ],
      caseStudy: {
        title: 'Inventory Management Revolution',
        company: 'Distribuidora Nacional',
        result: '30% reduction in stockouts',
        description: 'Implemented predictive inventory management system that automatically adjusts stock levels based on demand patterns and supplier reliability.'
      },
      tools: [
        {
          name: 'Claude AI',
          description: 'Process documentation and optimization analysis',
          useCase: 'Workflow analysis and improvement recommendations'
        },
        {
          name: 'Predictive Analytics Platform',
          description: 'Supply chain forecasting and optimization',
          useCase: 'Demand forecasting and inventory optimization'
        },
        {
          name: 'IoT Integration AI',
          description: 'Real-time operational monitoring',
          useCase: 'Equipment monitoring and predictive maintenance'
        }
      ]
    },
    'customer-service': {
      title: 'AI Solutions for Customer Service',
      description: 'Enhance customer experience and service efficiency with AI-powered tools',
      icon: 'Headphones',
      color: 'bg-red-500',
      challenges: [
        'High volume of repetitive customer inquiries',
        'Inconsistent response quality across agents',
        'Long response times during peak periods',
        'Difficulty tracking customer satisfaction trends'
      ],
      solutions: [
        {
          title: 'Intelligent Customer Support',
          description: 'AI-powered response suggestions and automated ticket routing',
          features: [
            'Automated response generation',
            'Sentiment analysis and priority routing',
            'Knowledge base optimization',
            'Customer satisfaction prediction'
          ],
          timeToImplement: '3-4 weeks',
          pricing: 'From $4,500 USD'
        },
        {
          title: 'Customer Insights Platform',
          description: 'AI-driven customer behavior analysis and improvement recommendations',
          features: [
            'Customer journey mapping',
            'Satisfaction trend analysis',
            'Churn prediction and prevention',
            'Personalized service recommendations'
          ],
          timeToImplement: '4-5 weeks',
          pricing: 'From $5,500 USD'
        }
      ],
      caseStudy: {
        title: 'Customer Service Transformation',
        company: 'ServiceCorp Paraguay',
        result: '60% reduction in response time',
        description: 'Implemented AI-powered response suggestions and automated routing, improving customer satisfaction scores by 40% while reducing agent workload.'
      },
      tools: [
        {
          name: 'ChatGPT',
          description: 'Customer response generation and chat automation',
          useCase: 'Automated responses and chat support'
        },
        {
          name: 'Claude AI',
          description: 'Complex inquiry analysis and resolution',
          useCase: 'Technical support and detailed problem solving'
        },
        {
          name: 'Sentiment Analysis AI',
          description: 'Customer emotion and satisfaction tracking',
          useCase: 'Customer feedback analysis and priority routing'
        }
      ]
    }
  }), [])

  useEffect(() => {
    setIsLoading(true)
    // Simulate loading time
    setTimeout(() => {
      const deptContent = departmentContent[department]
      if (deptContent) {
        setContent(deptContent)
      }
      setIsLoading(false)
    }, 500)
  }, [department, departmentContent])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading department solutions...</p>
        </div>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Department Not Found</h1>
          <p className="text-gray-600 mb-8">The requested department solutions page could not be found.</p>
          <DynamicButton 
            content={{
              text: "Back to Home",
              variant: "default"
            }}
            className="bg-blue-600 hover:bg-blue-700"
          />
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
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">Home</Link>
              <Link href="/servicios" className="text-gray-600 hover:text-blue-600 transition-colors">Services</Link>
              <Link href="/sobre-nosotros" className="text-gray-600 hover:text-blue-600 transition-colors">About</Link>
              <Link href="/blog" className="text-gray-600 hover:text-blue-600 transition-colors">Blog</Link>
              <Link href="/contacto" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</Link>
              <LanguageToggler />
              <DynamicButton 
                content={{
                  text: "Free Consultation",
                  variant: "default"
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
            className="text-center mb-16"
          >
            <div className={`w-20 h-20 ${content.color} rounded-3xl flex items-center justify-center mx-auto mb-8`}>
              <DynamicIcon name={content.icon} className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              {content.title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
              {content.description}
            </p>
            <DynamicButton 
              content={{
                text: "Schedule Consultation",
                variant: "default",
                size: "lg"
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
            />
          </motion.div>
        </div>
      </section>

      {/* Challenges Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Common Challenges We Solve</h2>
            <p className="text-lg text-gray-600">Issues that our AI solutions specifically address for your department</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {content.challenges.map((challenge, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-start space-x-3 p-6 bg-gray-50 rounded-lg"
              >
                <DynamicIcon name="AlertCircle" className="h-6 w-6 text-red-500 mt-1 flex-shrink-0" />
                <p className="text-gray-700">{challenge}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our AI Solutions</h2>
            <p className="text-lg text-gray-600">Tailored solutions designed specifically for your department&apos;s needs</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            {content.solutions.map((solution, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-white p-8 rounded-xl shadow-sm border"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{solution.title}</h3>
                <p className="text-gray-600 mb-6">{solution.description}</p>
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Key Features:</h4>
                  <ul className="space-y-2">
                    {solution.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-2">
                        <DynamicIcon name="Check" className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex justify-between items-center pt-4 border-t">
                  <div>
                    <p className="text-sm text-gray-500">Implementation Time</p>
                    <p className="font-semibold text-gray-900">{solution.timeToImplement}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Starting Price</p>
                    <p className="font-semibold text-gray-900">{solution.pricing}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Study Section */}
      {content.caseStudy && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Success Story</h2>
              <p className="text-lg text-gray-600">Real results from our AI implementation</p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-xl max-w-4xl mx-auto"
            >
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{content.caseStudy.title}</h3>
                <p className="text-blue-100">{content.caseStudy.company}</p>
              </div>
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-blue-200 mb-2">{content.caseStudy.result}</div>
              </div>
              <p className="text-blue-100 text-center max-w-2xl mx-auto">
                {content.caseStudy.description}
              </p>
            </motion.div>
          </div>
        </section>
      )}

      {/* Tools Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">AI Tools We Use</h2>
            <p className="text-lg text-gray-600">Cutting-edge AI technologies tailored for your department</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {content.tools.map((tool, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-sm border text-center"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <DynamicIcon name="Brain" className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{tool.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{tool.description}</p>
                <p className="text-blue-600 text-sm font-medium">{tool.useCase}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Ready to Transform Your {content.title.split(' ').pop()}?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Schedule a free consultation to discuss how AI can revolutionize your department&apos;s workflow
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-6">
              <DynamicButton 
                content={{
                  text: "Schedule Free Consultation",
                  variant: "default",
                  size: "default"
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5"
              />
              <DynamicButton 
                content={{
                  text: "Download Case Study",
                  variant: "outline",
                  size: "default"
                }}
                className="px-6 py-2.5 border-gray-300"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm text-gray-600 border-t pt-6">
              <div className="flex items-center justify-center gap-2">
                <span>📧</span>
                <span>info@aiparaguay.com</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span>📱</span>
                <span>+595981324569</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span>🌐</span>
                <span>Serving clients worldwide</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <DynamicIcon name="Brain" className="h-6 w-6 text-blue-400" />
              <span className="text-lg font-bold">AI Paraguay</span>
            </div>
            <div className="text-sm text-gray-400">
              © 2025 AI Paraguay. Empowering businesses with artificial intelligence.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
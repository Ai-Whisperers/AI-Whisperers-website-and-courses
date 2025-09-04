// Schema markup utilities for SEO optimization
import type { Organization, WebSite, Service, Person } from 'schema-dts'

// Base organization schema
export const organizationSchema: Organization = {
  "@type": "Organization",
  "@id": "https://aiparaguay.com/#organization",
  "name": "AI Paraguay",
  "alternateName": "AI Paraguay Consultancy",
  "description": "Leading AI consultancy helping businesses implement practical artificial intelligence solutions. We specialize in training non-technical teams to use AI tools like ChatGPT, Claude, Cursor, and Windsurf.",
  "url": "https://aiparaguay.com",
  "logo": "https://aiparaguay.com/logo.png",
  "image": "https://aiparaguay.com/og-image.png",
  "foundingDate": "2024",
  "founder": [
    {
      "@type": "Person",
      "name": "Ivan Weiss van der Pol",
      "jobTitle": "Founder & AI Strategy Director"
    },
    {
      "@type": "Person", 
      "name": "Kiryan Weiss van der Pol",
      "jobTitle": "Co-Founder & Technical Director"
    }
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+595981324569",
    "contactType": "customer service",
    "email": "info@aiparaguay.com",
    "availableLanguage": ["English", "Spanish"]
  },
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "PY",
    "addressRegion": "Central",
    "addressLocality": "Asunción"
  },
  "areaServed": "Worldwide",
  "serviceArea": {
    "@type": "GeoCircle",
    "name": "Global Service Area"
  },
  "knowsAbout": [
    "Artificial Intelligence",
    "Machine Learning",
    "ChatGPT Training",
    "Claude AI Implementation", 
    "Business Process Automation",
    "AI Strategy Consulting",
    "Digital Transformation"
  ],
  "sameAs": [
    "https://linkedin.com/company/ai-paraguay",
    "https://twitter.com/aiparaguay"
  ]
}

// Website schema
export const websiteSchema: WebSite = {
  "@type": "WebSite",
  "@id": "https://aiparaguay.com/#website",
  "name": "AI Paraguay - AI Consultancy & Training",
  "description": "Transform your business with practical AI solutions. Expert training in ChatGPT, Claude AI, and modern AI tools for all departments.",
  "url": "https://aiparaguay.com",
  "publisher": {
    "@id": "https://aiparaguay.com/#organization"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://aiparaguay.com/search?q={search_term_string}"
  },
  "inLanguage": "en-US"
}

// Services schema
export const servicesSchema: Service[] = [
  {
    "@type": "Service",
    "name": "Business Training",
    "description": "Comprehensive AI training for non-technical teams using ChatGPT, Claude, and modern AI tools",
    "provider": {
      "@id": "https://aiparaguay.com/#organization"
    },
    "serviceType": "AI Training",
    "areaServed": "Worldwide",
    "offers": {
      "@type": "Offer",
      "price": "2000",
      "priceCurrency": "USD",
      "priceValidUntil": "2025-12-31",
      "availability": "InStock"
    }
  },
  {
    "@type": "Service", 
    "name": "Tool Implementation",
    "description": "Custom AI tool implementation and integration for business workflows",
    "provider": {
      "@id": "https://aiparaguay.com/#organization"
    },
    "serviceType": "AI Implementation",
    "areaServed": "Worldwide",
    "offers": {
      "@type": "Offer",
      "price": "5000",
      "priceCurrency": "USD",
      "priceValidUntil": "2025-12-31", 
      "availability": "InStock"
    }
  },
  {
    "@type": "Service",
    "name": "Process Automation", 
    "description": "Automated business process optimization using artificial intelligence",
    "provider": {
      "@id": "https://aiparaguay.com/#organization"
    },
    "serviceType": "Process Automation",
    "areaServed": "Worldwide",
    "offers": {
      "@type": "Offer",
      "price": "8000",
      "priceCurrency": "USD", 
      "priceValidUntil": "2025-12-31",
      "availability": "InStock"
    }
  },
  {
    "@type": "Service",
    "name": "Digital Strategy",
    "description": "Comprehensive AI strategy and digital transformation consulting",
    "provider": {
      "@id": "https://aiparaguay.com/#organization"
    },
    "serviceType": "AI Strategy Consulting",
    "areaServed": "Worldwide",
    "offers": {
      "@type": "Offer",
      "price": "15000",
      "priceCurrency": "USD",
      "priceValidUntil": "2025-12-31",
      "availability": "InStock"
    }
  }
]

// Department-specific service schemas
export const departmentServicesSchema = {
  executives: {
    "@type": "Service",
    "name": "AI Solutions for Executives",
    "description": "Strategic decision-making and executive synthesis powered by artificial intelligence",
    "serviceType": "Executive AI Solutions",
    "provider": { "@id": "https://aiparaguay.com/#organization" }
  },
  salesTeams: {
    "@type": "Service", 
    "name": "AI Solutions for Sales Teams",
    "description": "Boost sales performance with AI-powered prospect research and proposal automation",
    "serviceType": "Sales AI Solutions",
    "provider": { "@id": "https://aiparaguay.com/#organization" }
  },
  financeStaff: {
    "@type": "Service",
    "name": "AI Solutions for Finance Teams", 
    "description": "Automate financial analysis, reporting, and budget management with AI",
    "serviceType": "Finance AI Solutions",
    "provider": { "@id": "https://aiparaguay.com/#organization" }
  },
  hrTeams: {
    "@type": "Service",
    "name": "AI Solutions for HR Teams",
    "description": "Transform recruitment, employee analytics, and HR processes with AI", 
    "serviceType": "HR AI Solutions",
    "provider": { "@id": "https://aiparaguay.com/#organization" }
  },
  operations: {
    "@type": "Service",
    "name": "AI Solutions for Operations",
    "description": "Optimize processes, supply chain management, and operational efficiency with AI",
    "serviceType": "Operations AI Solutions", 
    "provider": { "@id": "https://aiparaguay.com/#organization" }
  },
  customerService: {
    "@type": "Service",
    "name": "AI Solutions for Customer Service",
    "description": "Enhance customer experience and service efficiency with AI-powered tools",
    "serviceType": "Customer Service AI Solutions",
    "provider": { "@id": "https://aiparaguay.com/#organization" }
  }
}

// Person schemas for team members
export const teamMemberSchemas: Person[] = [
  {
    "@type": "Person",
    "name": "Ivan Weiss van der Pol",
    "jobTitle": "Founder & AI Strategy Director",
    "description": "AI strategy expert with extensive experience in business transformation and artificial intelligence implementation",
    "worksFor": {
      "@id": "https://aiparaguay.com/#organization"
    },
    "knowsAbout": [
      "AI Strategy",
      "Business Transformation", 
      "Digital Innovation",
      "Executive Consulting"
    ],
    "url": "https://aiparaguay.com/team/ivan-weiss-van-der-pol"
  },
  {
    "@type": "Person",
    "name": "Kiryan Weiss van der Pol", 
    "jobTitle": "Co-Founder & Technical Director",
    "description": "Technical AI expert specializing in implementation, automation, and advanced AI tool integration",
    "worksFor": {
      "@id": "https://aiparaguay.com/#organization"
    },
    "knowsAbout": [
      "AI Implementation",
      "Process Automation",
      "Technical Integration", 
      "AI Tools"
    ],
    "url": "https://aiparaguay.com/team/kiryan-weiss-van-der-pol"
  }
]

// FAQ Page schema
export const faqSchema = {
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is AI Paraguay and what do you do?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "AI Paraguay is a leading AI consultancy that helps businesses implement practical artificial intelligence solutions. We specialize in training non-technical teams to use AI tools like ChatGPT, Claude, Cursor, and Windsurf to improve productivity and automate daily tasks."
      }
    },
    {
      "@type": "Question", 
      "name": "How much do your services cost?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our services range from $2,000 USD for Business Training to $15,000 USD for comprehensive Digital Strategy. We offer flexible pricing based on your organization's size and specific needs. All packages include training, implementation, and initial support."
      }
    },
    {
      "@type": "Question",
      "name": "How long does a typical AI implementation take?",
      "acceptedAnswer": {
        "@type": "Answer", 
        "text": "Implementation times vary by service: Business Training (2-4 weeks), Tool Implementation (4-8 weeks), Process Automation (6-12 weeks), and Digital Strategy (3-6 months). We provide immediate value from day one."
      }
    }
  ]
}

// Generate structured data for any page
export function generatePageSchema(pageType: string, pageData?: Record<string, unknown>) {
  const baseSchema = {
    "@context": "https://schema.org",
    "@graph": [
      organizationSchema,
      websiteSchema
    ]
  }

  switch (pageType) {
    case 'homepage':
      return {
        ...baseSchema,
        "@graph": [
          ...baseSchema["@graph"],
          ...servicesSchema
        ]
      }
    
    case 'services':
      return {
        ...baseSchema,
        "@graph": [
          ...baseSchema["@graph"],
          ...servicesSchema
        ]
      }
      
    case 'about':
      return {
        ...baseSchema,
        "@graph": [
          ...baseSchema["@graph"],
          ...teamMemberSchemas
        ]
      }
      
    case 'faq':
      return {
        ...baseSchema,
        "@graph": [
          ...baseSchema["@graph"],
          faqSchema
        ]
      }
      
    case 'department':
      if (pageData?.department) {
        const deptSchema = departmentServicesSchema[pageData.department as keyof typeof departmentServicesSchema]
        if (deptSchema) {
          return {
            ...baseSchema,
            "@graph": [
              ...baseSchema["@graph"],
              deptSchema
            ]
          }
        }
      }
      return baseSchema
      
    default:
      return baseSchema
  }
}
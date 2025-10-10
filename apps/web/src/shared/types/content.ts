// Base types for content management
export interface Image {
  src: string
  alt: string
  width?: number
  height?: number
}

export interface Link {
  href: string
  text: string
  external?: boolean
  target?: '_blank' | '_self'
}

export interface Button {
  text: string
  href?: string
  variant?: 'default' | 'outline' | 'ghost' | 'destructive'
  size?: 'default' | 'sm' | 'lg'
  icon?: string
  onClick?: string
  external?: boolean
}

export interface SocialLink {
  platform: string
  url: string
  icon: string
}

// Navigation types
export interface NavigationItem {
  text: string
  href: string
  external?: boolean
}

export interface Navigation {
  brand: {
    text: string
    logo?: Image
  }
  items: NavigationItem[]
  cta: Button
}

// Hero section types
export interface HeroBenefit {
  icon: string
  title: string
  description: string
}

export interface Hero {
  headline: string
  subheadline: string
  description: string
  location: string
  primaryCta: Button
  secondaryCta: Button
  benefits: HeroBenefit[]
}

// Features/Services types
export interface FeatureItem {
  title: string
  description: string
  icon: string
}

export interface Feature {
  title: string
  description: string
  items: FeatureItem[]
}

// Department/Service types
export interface Department {
  title: string
  description: string
  icon: string
  color?: string
}

// Tool types
export interface Tool {
  title: string
  description: string
  color: string
}

// Stats/Metrics types
export interface Metric {
  value: string
  description: string
}

export interface Stats {
  title: string
  description: string
  metrics: Metric[]
  company?: Metric[] // For backward compatibility with existing content
}

// Contact types
export interface ContactInfo {
  type: 'email' | 'phone' | 'whatsapp' | 'address' | 'web'
  label: string
  value: string
  link?: string
}

export interface Contact {
  title: string
  description: string
  primaryCta: Button
  secondaryCta: Button
  info: ContactInfo[]
}

// Footer types
export interface Footer {
  brand: {
    text: string
    logo?: Image
  }
  copyright: string
  socialLinks?: SocialLink[]
}

// Service types for homepage
export interface Service {
  title: string
  shortDescription: string
  description?: string
  price: string
  duration: string
  icon?: string
}

// Main page content interface - flexible for different page types
export interface PageContent {
  meta: {
    title: string
    description: string
    keywords: string[]
    language: string
  }
  navigation?: Navigation // Optional - usually shared globally
  hero: Hero
  services?: Service[] // Services array for direct access
  features?: {
    differentiators?: Feature
    services?: {
      title: string
      description: string
      departments: Department[]
      goalStatement: string
    }
    tools?: {
      title: string
      items: Tool[]
    }
  }
  stats?: Stats
  contact?: Contact // Optional for pages that don't need contact CTAs
  footer?: Footer // Optional - usually shared globally
  
  // About page specific fields
  story?: {
    title: string
    content: string
  }
  mission?: {
    title: string
    description: string
  }
  vision?: {
    title: string
    description: string
  }
  values?: {
    title: string
    items: FeatureItem[]
  }
  team?: {
    title: string
    members: Array<{
      name: string
      role: string
      bio: string
      expertise: string[]
      image: Image
    }>
  }
  
  // Services page specific fields
  mainServices?: {
    title: string
    description: string
    services: Array<{
      icon: string
      title: string
      description: string
      features: string[]
      duration: string
      price: string
    }>
  }
  departmentServices?: {
    title: string
    description: string
    departments: Array<{
      title: string
      icon: string
      services: string[]
    }>
  }
  tools?: {
    title: string
    description: string
    categories: Array<{
      title: string
      tools: Array<{
        name: string
        description: string
        useCase: string
      }>
    }>
  }
  process?: {
    title: string
    description: string
    steps: Array<{
      number: string
      title: string
      description: string
      duration: string
    }>
  }
  pricing?: {
    title: string
    description: string
    plans: Array<{
      name: string
      price: string
      period: string
      description: string
      features: string[]
      popular?: boolean
      cta: Button
    }>
  }
  testimonials?: {
    title: string
    items: Array<{
      quote: string
      author: string
      position: string
      company: string
    }>
  }
  
  // Contact page specific fields
  contactOptions?: {
    title: string
    description: string
    options: Array<{
      icon: string
      title: string
      description: string
      value: string
      action: Button
      primaryMethod?: boolean
    }>
  }
  officeInfo?: {
    title: string
    description: string
    address: {
      street: string
      neighborhood: string
      city: string
      country: string
      zipCode: string
    }
    workingHours: {
      weekdays: string
      saturday: string
      sunday: string
    }
    map: {
      embedUrl: string
    }
  }
  consultationForm?: {
    title: string
    description: string
    fields: Array<{
      name: string
      label: string
      type: string
      required: boolean
      placeholder?: string
      options?: string[]
      rows?: number
    }>
    submitButton: {
      text: string
      loadingText: string
    }
    privacyNote: string
  }
  faq?: {
    title: string
    items: Array<{
      question: string
      answer: string
    }>
  }
  socialProof?: {
    title: string
    description: string
    stats: Array<{
      value: string
      label: string
    }>
    testimonials: Array<{
      quote: string
      author: string
      company: string
    }>
  }
  
  // Blog page specific fields
  featuredPost?: {
    title: string
    post: {
      title: string
      excerpt: string
      readTime: string
      date: string
      category: string
      image: Image
      href: string
    }
  }
  categories?: {
    title: string
    items: Array<{
      name: string
      description: string
      count: number
      color: string
    }>
  }
  posts?: {
    title: string
    items: Array<{
      title: string
      excerpt: string
      readTime: string
      date: string
      category: string
      author: string
      tags: string[]
      href: string
    }>
  }
  caseStudies?: {
    title: string
    description: string
    studies: Array<{
      company: string
      industry: string
      challenge: string
      solution: string
      results: string[]
      duration: string
      teamSize: string
      href: string
    }>
  }
  resources?: {
    title: string
    description: string
    items: Array<{
      title: string
      description: string
      type: string
      downloadLink: string
    }>
  }
  newsletter?: {
    title: string
    description: string
    benefits: string[]
    form: {
      emailPlaceholder: string
      submitText: string
      privacyNote: string
    }
  }
}

// Content loading result types
export interface ContentResult<T> {
  data: T | null
  error: string | null
  loading: boolean
}

// Enhanced content loader types
export interface ContentDirectives {
  $use?: {
    navigation?: boolean
    footer?: boolean
    common?: Record<string, boolean>
    [key: string]: unknown
  }
  $extend?: boolean | string
  [key: string]: any
}

export interface ExtendableContent extends ContentDirectives {
  [key: string]: any
}
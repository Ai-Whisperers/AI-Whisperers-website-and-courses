# Content System Architecture

**Version:** 1.0.0
**Last Updated:** October 12, 2025
**Status:** Production-Ready
**Approach:** Build-Time Compilation (Zero Runtime File I/O)

---

## Table of Contents

1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Build-Time Compilation](#build-time-compilation)
4. [Multi-Language Support](#multi-language-support)
5. [Content Types](#content-types)
6. [YAML Content Structure](#yaml-content-structure)
7. [TypeScript Compiled Output](#typescript-compiled-output)
8. [Runtime Content Access](#runtime-content-access)
9. [Workflow & Commands](#workflow--commands)
10. [Best Practices](#best-practices)

---

## Overview

The AI Whisperers platform uses a **build-time content compilation system** that transforms YAML content files into type-safe TypeScript modules. This approach provides:

✅ **Zero Runtime File I/O**: All content pre-compiled at build time
✅ **Deployment Compatibility**: Works on serverless platforms (Render.com, Vercel, etc.)
✅ **Type Safety**: Generated TypeScript types with IntelliSense
✅ **Multi-Language Support**: EN/ES with automatic fallback
✅ **Performance**: No file system access during runtime
✅ **Developer Experience**: Simple YAML authoring with full TypeScript validation

**Key Principle**: Content is data, not code. Write in YAML, consume as TypeScript.

---

## System Architecture

### Content Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                     CONTENT COMPILATION FLOW                      │
└──────────────────────────────────────────────────────────────────┘

1. AUTHORING (Development)
   ├─ Write YAML content files
   │  └─ apps/web/src/content/pages/*.yml
   │
   └─ Define TypeScript types
      └─ apps/web/src/types/content.ts

2. BUILD-TIME COMPILATION (npm run compile-content)
   ├─ Scan YAML files
   ├─ Parse with js-yaml
   ├─ Replace environment variables
   ├─ Validate structure
   ├─ Generate TypeScript files
   │  └─ apps/web/src/lib/content/compiled/*.ts
   │
   └─ Generate index & fallback
      ├─ index.ts (exports all content)
      └─ fallback.ts (default content)

3. RUNTIME ACCESS (Server Components)
   ├─ Import compiled modules
   │  import { getPageContent } from '@/lib/content/server'
   │
   ├─ Load content with language
   │  const content = await getPageContent('homepage', 'en')
   │
   └─ Render components
      <Homepage content={content} />

4. CLIENT-SIDE (Language Switching)
   ├─ Load all languages at once
   │  const localized = await getLocalizedPageContent('homepage')
   │
   └─ Switch instantly
      const content = localized[currentLanguage]
```

### File Structure

```
apps/web/src/
├── content/                      # Source YAML files
│   └── pages/
│       ├── homepage.yml          # English (default)
│       ├── homepage-es.yml       # Spanish
│       ├── about.yml
│       ├── about-es.yml
│       ├── services.yml
│       └── ... (22 YAML files)
│
├── types/
│   └── content.ts                # TypeScript type definitions
│
└── lib/content/
    ├── server.ts                 # Public API (re-exports)
    ├── server-compiled.ts        # Runtime content access
    └── compiled/                 # Generated TypeScript (build-time)
        ├── index.ts              # Content map & accessors
        ├── fallback.ts           # Default fallback content
        ├── homepage-en.ts        # Compiled English content
        ├── homepage-es.ts        # Compiled Spanish content
        └── ... (44 compiled files)

scripts/
└── compile-content.js            # Build-time compiler script
```

---

## Build-Time Compilation

### Compilation Script

**File:** `scripts/compile-content.js` (341 lines)

The compiler performs these steps:

1. **Scan YAML Files** in `apps/web/src/content/pages/`
2. **Parse Filenames** to extract page name and language
3. **Load & Parse YAML** with `js-yaml`
4. **Replace Environment Variables** (e.g., `${API_URL}`)
5. **Validate Structure** (meta.title, meta.description required)
6. **Generate TypeScript** modules with type annotations
7. **Create Index File** with content map and accessor functions
8. **Create Fallback** content for missing pages

### Key Functions

#### 1. parseFileName()
```javascript
// Examples:
//   homepage.yml → { pageName: 'homepage', language: 'en', fullKey: 'homepage-en' }
//   homepage-es.yml → { pageName: 'homepage', language: 'es', fullKey: 'homepage-es' }

function parseFileName(fileName) {
  const nameWithoutExt = fileName.replace(/\.(yml|yaml)$/, '')
  const match = nameWithoutExt.match(/^(.+?)-([a-z]{2})$/)

  if (match) {
    return {
      pageName: match[1],      // "homepage"
      language: match[2],       // "es"
      fullKey: nameWithoutExt   // "homepage-es"
    }
  } else {
    return {
      pageName: nameWithoutExt, // "homepage"
      language: 'en',            // default to English
      fullKey: `${nameWithoutExt}-en` // "homepage-en"
    }
  }
}
```

#### 2. loadYamlFile()
```javascript
function loadYamlFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const parsed = yaml.load(content)

    if (!parsed) {
      console.warn(`Warning: Empty or invalid YAML in ${filePath}`)
      return null
    }

    // Replace environment variables in parsed content
    return replaceEnvVariables(parsed)
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error.message)
    return null
  }
}
```

#### 3. replaceEnvVariables()
```javascript
// Replaces ${VAR_NAME} with process.env.VAR_NAME
function replaceEnvVariables(content) {
  const contentStr = JSON.stringify(content)
  const replaced = contentStr.replace(/\$\{([A-Z_]+)\}/g, (match, envVar) => {
    const value = process.env[envVar]
    if (!value) {
      console.warn(`⚠️  Environment variable ${envVar} not found, keeping placeholder`)
      return match
    }
    return value
  })
  return JSON.parse(replaced)
}
```

#### 4. generatePageContent()
```javascript
function generatePageContent(fullKey, pageName, language, content) {
  const variableName = fullKey.replace(/[-]/g, '_') // homepage-en → homepage_en

  const typescript = `// Auto-generated content file - Do not edit manually
// Generated from: src/content/pages/${pageName}${language === 'en' ? '' : '-' + language}.yml
// Language: ${language.toUpperCase()}

import type { PageContent } from '@/types/content';

export const ${variableName}Content: PageContent = ${JSON.stringify(content, null, 2)} as const;

export default ${variableName}Content;
`

  return typescript
}
```

### Environment Variable Support

Content files can reference environment variables:

**YAML:**
```yaml
meta:
  title: "AI Whisperers - ${APP_NAME}"
  description: "Visit us at ${SITE_URL}"

contact:
  info:
    - type: "email"
      value: "${CONTACT_EMAIL}"
    - type: "phone"
      value: "${CONTACT_PHONE}"
```

**Compiled TypeScript:**
```typescript
export const contact_enContent: PageContent = {
  "meta": {
    "title": "AI Whisperers - Learning Platform",
    "description": "Visit us at https://aiwhisperers.com"
  },
  "contact": {
    "info": [
      { "type": "email", "value": "ai.whisperer.wvdp@gmail.com" },
      { "type": "phone", "value": "+506-1234-5678" }
    ]
  }
} as const;
```

---

## Multi-Language Support

### Language File Naming Convention

```
homepage.yml        → homepage-en.ts (English - default)
homepage-es.yml     → homepage-es.ts (Spanish)
about.yml           → about-en.ts (English - default)
about-es.yml        → about-es.ts (Spanish)
services.yml        → services-en.ts
services-es.yml     → services-es.ts
```

**Rules:**
- Files without language suffix default to English (`en`)
- Language suffix: `-{2-letter-code}` (e.g., `-es`, `-fr`, `-de`)
- Generated TypeScript uses full key with language: `homepage-en`, `homepage-es`

### Content Map Structure

**Generated File:** `apps/web/src/lib/content/compiled/index.ts`

```typescript
import type { PageContent } from '@/types/content';
import { homepage_enContent } from './homepage-en';
import { homepage_esContent } from './homepage-es';
import { about_enContent } from './about-en';
import { about_esContent } from './about-es';
// ... more imports

export const contentMap: Record<string, PageContent> = {
  'homepage-en': homepage_enContent,
  'homepage-es': homepage_esContent,
  'about-en': about_enContent,
  'about-es': about_esContent,
  // ... more mappings
} as const;

/**
 * Get compiled page content by full key (includes language)
 * @param fullKey - Page key with language (e.g., 'homepage-en', 'homepage-es')
 */
export function getCompiledPageContent(fullKey: string): PageContent | null {
  return contentMap[fullKey] || null;
}

/**
 * Get compiled page content with language fallback
 * @param pageName - Base page name (e.g., 'homepage')
 * @param language - Language code (e.g., 'en', 'es')
 */
export function getCompiledPageContentWithLang(
  pageName: string,
  language: string = 'en'
): PageContent | null {
  const key = `${pageName}-${language}`;
  return contentMap[key] || contentMap[`${pageName}-en`] || null;
}
```

### Language Fallback Strategy

```
Request: getPageContent('homepage', 'es')
  ├─ Try: homepage-es ✅ Found
  └─ Return: Spanish content

Request: getPageContent('homepage', 'fr')
  ├─ Try: homepage-fr ❌ Not found
  ├─ Fallback: homepage-en ✅ Found (English fallback)
  └─ Return: English content

Request: getPageContent('nonexistent', 'en')
  ├─ Try: nonexistent-en ❌ Not found
  ├─ Fallback: nonexistent-en ❌ Not found
  └─ Return: Fallback content (generated)
```

---

## Content Types

### PageContent Interface

**File:** `apps/web/src/types/content.ts` (428 lines)

The `PageContent` interface is highly flexible, supporting multiple page types:

```typescript
export interface PageContent {
  // ============================================================================
  // REQUIRED FIELDS (All Pages)
  // ============================================================================
  meta: {
    title: string           // SEO title
    description: string     // Meta description
    keywords: string[]      // SEO keywords
    language: string        // 'en' | 'es'
  }

  hero: Hero                // Hero section (always present)

  // ============================================================================
  // COMMON FIELDS (Optional - Most Pages)
  // ============================================================================
  navigation?: Navigation   // Usually shared globally
  footer?: Footer           // Usually shared globally
  stats?: Stats             // Metrics/statistics section
  contact?: Contact         // Contact CTA section
  features?: {              // Feature sections
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

  // ============================================================================
  // PAGE-SPECIFIC FIELDS
  // ============================================================================

  // Homepage
  services?: Service[]      // Featured services
  testimonials?: Testimonial[]

  // About Page
  story?: { title: string; content: string }
  mission?: { title: string; description: string }
  vision?: { title: string; description: string }
  values?: { title: string; items: FeatureItem[] }
  team?: { title: string; members: TeamMember[] }

  // Services Page
  mainServices?: { title: string; description: string; services: ServiceDetail[] }
  departmentServices?: { title: string; departments: Department[] }
  tools?: { title: string; categories: ToolCategory[] }
  process?: { title: string; steps: ProcessStep[] }
  pricing?: { title: string; plans: PricingPlan[] }

  // Contact Page
  contactOptions?: { title: string; options: ContactOption[] }
  officeInfo?: { title: string; address: Address; workingHours: WorkingHours; map: Map }
  consultationForm?: { title: string; fields: FormField[]; submitButton: Button }
  faq?: { title: string; items: FAQItem[] }
  socialProof?: { title: string; stats: Stat[]; testimonials: Testimonial[] }

  // Blog/Resources
  featuredPost?: { title: string; post: Post }
  categories?: { title: string; items: Category[] }
  posts?: { title: string; items: Post[] }
  caseStudies?: { title: string; studies: CaseStudy[] }
  resources?: { title: string; items: Resource[] }
  newsletter?: { title: string; description: string; form: NewsletterForm }
}
```

### Core Type Definitions

```typescript
// Hero Section
export interface Hero {
  headline: string
  subheadline: string
  description: string
  location: string
  primaryCta: Button
  secondaryCta: Button
  benefits: HeroBenefit[]
}

export interface HeroBenefit {
  icon: string          // Lucide icon name (e.g., "Zap", "Award")
  title: string
  description: string
}

// Navigation
export interface Navigation {
  brand: {
    text: string
    logo?: Image
  }
  items: NavigationItem[]
  cta: Button
}

export interface NavigationItem {
  text: string
  href: string
  external?: boolean
}

// Button
export interface Button {
  text: string
  href?: string
  variant?: 'default' | 'outline' | 'ghost' | 'destructive'
  size?: 'default' | 'sm' | 'lg'
  icon?: string
  onClick?: string
  external?: boolean
}

// Feature
export interface Feature {
  title: string
  description: string
  items: FeatureItem[]
}

export interface FeatureItem {
  title: string
  description: string
  icon: string
}

// Stats
export interface Stats {
  title: string
  description: string
  metrics: Metric[]
}

export interface Metric {
  value: string         // e.g., "10+", "$1M", "95%"
  description: string
}

// Contact
export interface Contact {
  title: string
  description: string
  primaryCta: Button
  secondaryCta: Button
  info: ContactInfo[]
}

export interface ContactInfo {
  type: 'email' | 'phone' | 'whatsapp' | 'address' | 'web'
  label: string
  value: string
  link?: string
}

// Footer
export interface Footer {
  brand: {
    text: string
    logo?: Image
  }
  copyright: string
  socialLinks?: SocialLink[]
}
```

---

## YAML Content Structure

### Example: Homepage (English)

**File:** `apps/web/src/content/pages/homepage.yml`

```yaml
meta:
  title: "AI Whisperers - Master AI with World-Class Education"
  description: "Comprehensive AI courses from beginner to expert. Learn artificial intelligence through hands-on projects, real-world applications, and expert instruction."
  keywords:
    - "AI courses"
    - "artificial intelligence"
    - "machine learning"
    - "AI education"
  language: "en"

navigation:
  brand:
    text: "AI Whisperers"
  items:
    - text: "Home"
      href: "/"
    - text: "Services"
      href: "/services"
    - text: "Courses"
      href: "/courses"
    - text: "About"
      href: "/about"
    - text: "Contact"
      href: "/contact"
  cta:
    text: "Get Started"
    variant: "default"

hero:
  headline: "Master AI with World-Class Education"
  subheadline: "Transform your career with comprehensive AI courses from beginner to expert"
  description: "Learn artificial intelligence through hands-on projects, real-world applications, and instructors. Start your AI journey today with self-paced learning."
  location: "Available Worldwide - Learn at Your Own Pace"
  primaryCta:
    text: "Start Learning Today"
    href: "/courses"
    variant: "default"
  secondaryCta:
    text: "View Courses"
    href: "/courses"
    variant: "outline"
  benefits:
    - icon: "Zap"
      title: "Fast Track Learning"
      description: "Accelerated curriculum designed for busy professionals"
    - icon: "Award"
      title: "Course Completion"
      description: "Earn certificates of completion for your portfolio"
    - icon: "Users"
      title: "Expert Community"
      description: "Connect with AI practitioners worldwide"

features:
  - title: "Expert-led Courses"
    description: "Learn from industry professionals with real-world AI experience"
    icon: "graduation-cap"
  - title: "Hands-On Projects"
    description: "Build practical AI applications and add them to your portfolio"
    icon: "code"
  - title: "Career Development"
    description: "Build practical skills and portfolio projects for your career growth"
    icon: "briefcase"
  - title: "Community Access"
    description: "Join our exclusive community of AI practitioners"
    icon: "users"

courses:
  featured:
    - id: "ai-foundations"
      title: "AI Foundations"
      description: "Perfect starting point for AI beginners"
      duration: "12 hours"
      price: "$79"
      level: "Beginner"
    - id: "applied-ai"
      title: "Applied AI"
      description: "Build practical AI applications"
      duration: "15 hours"
      price: "$129"
      level: "Intermediate"

stats:
  title: "Comprehensive AI Education"
  description: "Quality courses designed for professionals advancing their careers in AI"
  metrics:
    - value: "Multiple Courses"
      description: "From Beginner to Advanced"
    - value: "Self-Paced"
      description: "Learn at Your Speed"
    - value: "Hands-On"
      description: "Project-Based Learning"

contact:
  title: "Ready to Start Your AI Journey?"
  description: "Get in touch with our team to find the perfect course for your goals"
  primaryCta:
    text: "Schedule Consultation"
    href: "/contact"
    variant: "default"
  secondaryCta:
    text: "Browse Courses"
    href: "/courses"
    variant: "outline"
  info:
    - type: "email"
      label: "Email"
      value: "ai.whisperer.wvdp@gmail.com"
    - type: "web"
      label: "Website"
      value: "aiwhisperers.com"

footer:
  brand:
    text: "AI Whisperers"
  copyright: "© 2025 AI Whisperers. All rights reserved."
```

### Example: Homepage (Spanish)

**File:** `apps/web/src/content/pages/homepage-es.yml`

```yaml
meta:
  title: "AI Whisperers - Domina la IA con Educación de Clase Mundial"
  description: "Cursos completos de IA desde principiante hasta experto. Aprende inteligencia artificial a través de proyectos prácticos, aplicaciones del mundo real e instructores expertos."
  keywords:
    - "cursos de IA"
    - "inteligencia artificial"
    - "aprendizaje automático"
    - "educación IA"
  language: "es"

hero:
  headline: "Domina la IA con Educación de Clase Mundial"
  subheadline: "Transforma tu carrera con cursos completos de IA desde principiante hasta experto"
  description: "Aprende inteligencia artificial a través de proyectos prácticos, aplicaciones del mundo real e instructores expertos. Comienza tu viaje en IA hoy con aprendizaje a tu propio ritmo."
  location: "Disponible en Todo el Mundo - Aprende a Tu Propio Ritmo"
  # ... rest of Spanish content
```

---

## TypeScript Compiled Output

### Example: Compiled Homepage (English)

**File:** `apps/web/src/lib/content/compiled/homepage-en.ts`

```typescript
// Auto-generated content file - Do not edit manually
// Generated from: src/content/pages/homepage.yml
// Language: EN

import type { PageContent } from '@/types/content';

export const homepage_enContent: PageContent = {
  "meta": {
    "title": "AI Whisperers - Master AI with World-Class Education",
    "description": "Comprehensive AI courses from beginner to expert. Learn artificial intelligence through hands-on projects, real-world applications, and expert instruction.",
    "keywords": [
      "AI courses",
      "artificial intelligence",
      "machine learning",
      "AI education",
      "programming",
      "technology"
    ],
    "language": "en"
  },
  "navigation": {
    "brand": {
      "text": "AI Whisperers"
    },
    "items": [
      { "text": "Home", "href": "/" },
      { "text": "Services", "href": "/services" },
      { "text": "Courses", "href": "/courses" },
      { "text": "About", "href": "/about" },
      { "text": "Contact", "href": "/contact" }
    ],
    "cta": {
      "text": "Get Started",
      "variant": "default"
    }
  },
  "hero": {
    "headline": "Master AI with World-Class Education",
    "subheadline": "Transform your career with comprehensive AI courses from beginner to expert",
    "description": "Learn artificial intelligence through hands-on projects, real-world applications, and instructors. Start your AI journey today with self-paced learning.",
    "location": "Available Worldwide - Learn at Your Own Pace",
    "primaryCta": {
      "text": "Start Learning Today",
      "href": "/courses",
      "variant": "default"
    },
    "secondaryCta": {
      "text": "View Courses",
      "href": "/courses",
      "variant": "outline"
    },
    "benefits": [
      {
        "icon": "Zap",
        "title": "Fast Track Learning",
        "description": "Accelerated curriculum designed for busy professionals"
      },
      {
        "icon": "Award",
        "title": "Course Completion",
        "description": "Earn certificates of completion for your portfolio"
      },
      {
        "icon": "Users",
        "title": "Expert Community",
        "description": "Connect with AI practitioners worldwide"
      }
    ]
  },
  // ... rest of content
} as const;

export default homepage_enContent;
```

**Benefits of Compiled Output:**
- ✅ **Type Safety**: Full IntelliSense in IDE
- ✅ **Immutability**: `as const` prevents runtime modifications
- ✅ **Tree Shaking**: Unused content eliminated in production
- ✅ **Fast Loading**: No file I/O, direct module import
- ✅ **Deployment**: Works on serverless platforms

---

## Runtime Content Access

### Server-Side API

**File:** `apps/web/src/lib/content/server-compiled.ts` (142 lines)

#### 1. getPageContent()

Load content for a single language with fallback.

```typescript
/**
 * Load page content using pre-compiled content modules
 * @param pageName - Base page name (e.g., 'homepage', 'about')
 * @param language - Language code (defaults to 'en')
 * @returns PageContent for the specified language with fallback to English
 */
export async function getPageContent(
  pageName: string,
  language: Language = 'en'
): Promise<PageContent> {
  try {
    const content = getCompiledPageContentWithLang(pageName, language)

    if (content && isValidPageContent(content)) {
      console.log(`✅ Loaded compiled content for: ${pageName}-${language}`)
      return content
    }

    console.warn(`⚠️  No compiled content found for ${pageName}-${language}, using fallback`)
    return getFallbackPageContent(pageName)

  } catch (error) {
    console.error(`❌ Error loading compiled content for ${pageName}-${language}:`, error)
    return getFallbackPageContent(pageName)
  }
}
```

**Usage in Server Components:**
```typescript
// app/page.tsx (Server Component)
import { getPageContent } from '@/lib/content/server'

export default async function HomePage() {
  const content = await getPageContent('homepage', 'en')

  return (
    <div>
      <h1>{content.hero.headline}</h1>
      <p>{content.hero.description}</p>
    </div>
  )
}
```

#### 2. getLocalizedPageContent()

Load content in ALL languages for client-side switching.

```typescript
/**
 * Load page content in ALL supported languages for client-side switching
 * @param pageName - Base page name (e.g., 'homepage')
 * @returns Object with content in all supported languages
 */
export async function getLocalizedPageContent(
  pageName: string
): Promise<LocalizedContent<PageContent>> {
  try {
    const [en, es] = await Promise.all([
      getPageContent(pageName, 'en'),
      getPageContent(pageName, 'es')
    ])

    return { en, es }
  } catch (error) {
    console.error(`❌ Error loading localized content for ${pageName}:`, error)

    const fallback = getFallbackPageContent(pageName)
    return { en: fallback, es: fallback }
  }
}
```

**Usage with Language Switching:**
```typescript
// app/page.tsx (Server Component)
import { getLocalizedPageContent } from '@/lib/content/server'
import DynamicHomepage from '@/components/pages/DynamicHomepage'

export default async function HomePage() {
  const localizedContent = await getLocalizedPageContent('homepage')

  return <DynamicHomepage localizedContent={localizedContent} />
}
```

```typescript
// components/pages/DynamicHomepage.tsx (Client Component)
'use client'

import { useI18n } from '@/contexts/i18n/I18nContext'
import type { LocalizedContent, PageContent } from '@/types/content'

interface Props {
  localizedContent: LocalizedContent<PageContent>
}

export default function DynamicHomepage({ localizedContent }: Props) {
  const { language } = useI18n()

  // Instant language switch (no re-fetch)
  const content = localizedContent[language]

  return (
    <div>
      <h1>{content.hero.headline}</h1>
      <p>{content.hero.description}</p>
    </div>
  )
}
```

#### 3. Validation Helper

```typescript
/**
 * Type-safe validation for page content structure
 */
function isValidPageContent(content: unknown): content is PageContent {
  if (!content || typeof content !== 'object') {
    return false
  }

  const contentObj = content as Record<string, any>

  // Check for minimum required structure
  if (!contentObj.meta || typeof contentObj.meta !== 'object') {
    return false
  }

  const meta = contentObj.meta as Record<string, any>
  if (typeof meta.title !== 'string' || typeof meta.description !== 'string') {
    return false
  }

  return true
}
```

---

## Workflow & Commands

### Development Workflow

```bash
# 1. Edit YAML content
code apps/web/src/content/pages/homepage.yml

# 2. Compile content
npm run compile-content
# or
pnpm compile-content

# 3. Start dev server (auto-compiles on startup)
npm run dev

# 4. Build for production (auto-compiles before build)
npm run build
```

### Package.json Scripts

```json
{
  "scripts": {
    "compile-content": "node scripts/compile-content.js",
    "dev": "npm run compile-content && next dev",
    "build": "npm run compile-content && next build",
    "prebuild": "npm run compile-content"
  }
}
```

### Compilation Output

```bash
$ npm run compile-content

🔨 Starting content compilation...
📋 Loading environment variables with priority: .env.local > .env...
📁 Found 22 content files
📄 Processing: homepage.yml → homepage-en (lang: en)
✅ Compiled: homepage-en.ts (EN)
📄 Processing: homepage-es.yml → homepage-es (lang: es)
✅ Compiled: homepage-es.ts (ES)
📄 Processing: about.yml → about-en (lang: en)
✅ Compiled: about-en.ts (EN)
📄 Processing: about-es.yml → about-es (lang: es)
✅ Compiled: about-es.ts (ES)
# ... 18 more files
📝 Generating content index...
🛡️  Generating fallback content...
🎉 Content compilation complete! Generated 22 content modules
📦 Output directory: apps/web/src/lib/content/compiled
```

### Watch Mode (Development)

For automatic recompilation on content changes, use a file watcher:

```bash
# Install nodemon (if not already installed)
npm install -D nodemon

# Add watch script to package.json
{
  "scripts": {
    "watch-content": "nodemon --watch apps/web/src/content/pages --ext yml,yaml --exec 'npm run compile-content'"
  }
}

# Run in separate terminal
npm run watch-content
```

---

## Best Practices

### 1. Content Authoring

#### ✅ DO: Use Clear, Semantic Structure
```yaml
hero:
  headline: "Clear, Action-Oriented Headline"
  description: "Concise description that explains the value proposition"
  primaryCta:
    text: "Start Now"
    href: "/signup"
```

#### ❌ DON'T: Use Vague or Generic Content
```yaml
hero:
  headline: "Welcome"
  description: "Some text"
  primaryCta:
    text: "Click here"
```

#### ✅ DO: Provide Fallback Values
```yaml
# Always provide reasonable defaults
stats:
  title: "Our Impact"
  metrics:
    - value: "10+"
      description: "Years of Experience"
```

#### ❌ DON'T: Leave Required Fields Empty
```yaml
stats:
  title: ""
  metrics: []
```

### 2. Multi-Language Content

#### ✅ DO: Keep Language Files in Sync
```bash
# English
homepage.yml         # Complete content

# Spanish
homepage-es.yml      # All sections translated
```

#### ❌ DON'T: Have Mismatched Structures
```yaml
# homepage.yml
hero:
  headline: "..."
  benefits:
    - ...

# homepage-es.yml (missing benefits)
hero:
  headline: "..."
```

#### ✅ DO: Use Consistent Keys
```yaml
# Both files should have the same structure
meta:
  title: "..."
  description: "..."
hero:
  headline: "..."
```

### 3. Type Safety

#### ✅ DO: Validate Types in Components
```typescript
import type { PageContent } from '@/types/content'

interface Props {
  content: PageContent  // Type-safe prop
}

export function MyComponent({ content }: Props) {
  return <h1>{content.hero.headline}</h1>  // IntelliSense works
}
```

#### ✅ DO: Use Type Guards
```typescript
if (content.features?.differentiators) {
  // TypeScript knows this is defined
  const items = content.features.differentiators.items
}
```

### 4. Performance

#### ✅ DO: Load Only Needed Content
```typescript
// Load single language (smaller payload)
const content = await getPageContent('homepage', 'en')
```

#### ❌ DON'T: Load All Content When Not Needed
```typescript
// Avoid if language switching is not needed
const localized = await getLocalizedPageContent('homepage')
```

#### ✅ DO: Use Selective Imports
```typescript
// Import only what you need
import { getPageContent } from '@/lib/content/server'

// Not the entire content map
import { contentMap } from '@/lib/content/compiled'
```

### 5. Error Handling

#### ✅ DO: Handle Missing Content Gracefully
```typescript
const content = await getPageContent('homepage', 'en')

// Always has fallback, but check specific sections
if (!content.features?.differentiators) {
  return <DefaultFeaturesSection />
}

return <FeaturesSection features={content.features.differentiators} />
```

#### ✅ DO: Log Warnings for Missing Translations
```typescript
// Compiler automatically logs warnings:
// ⚠️  No compiled content found for homepage-fr, using fallback
```

### 6. SEO Optimization

#### ✅ DO: Provide Complete Meta Tags
```yaml
meta:
  title: "Specific Page Title - Brand Name"
  description: "Concise description under 160 characters optimized for search engines"
  keywords:
    - "primary keyword"
    - "secondary keyword"
    - "long-tail keyword"
  language: "en"
```

#### ✅ DO: Use Unique Titles per Page
```yaml
# homepage.yml
meta:
  title: "AI Whisperers - Master AI Education"

# about.yml
meta:
  title: "About Us - AI Whisperers"

# services.yml
meta:
  title: "AI Services & Consulting - AI Whisperers"
```

### 7. Accessibility

#### ✅ DO: Provide Alt Text for Images
```yaml
hero:
  image:
    src: "/images/hero.jpg"
    alt: "Students learning AI in a modern classroom"
    width: 1200
    height: 600
```

#### ✅ DO: Use Descriptive Button Text
```yaml
cta:
  text: "Start Learning AI Today"  # Descriptive
  # NOT: "Click here" or "Learn more"
```

### 8. Environment Variables

#### ✅ DO: Use for Sensitive or Environment-Specific Data
```yaml
# .env.local
CONTACT_EMAIL=ai.whisperer.wvdp@gmail.com
API_URL=https://api.aiwhisperers.com

# content YAML
contact:
  info:
    - type: "email"
      value: "${CONTACT_EMAIL}"

api:
  baseUrl: "${API_URL}"
```

#### ❌ DON'T: Hardcode Sensitive Information
```yaml
# ❌ Bad - email exposed in source code
contact:
  info:
    - type: "email"
      value: "real-email@example.com"
```

### 9. Content Updates

#### ✅ DO: Recompile After Content Changes
```bash
# After editing YAML files
npm run compile-content

# Or use watch mode during development
npm run watch-content
```

#### ✅ DO: Test Both Languages After Updates
```typescript
// Test English
const enContent = await getPageContent('homepage', 'en')
console.log(enContent.hero.headline)

// Test Spanish
const esContent = await getPageContent('homepage', 'es')
console.log(esContent.hero.headline)
```

### 10. Version Control

#### ✅ DO: Commit Source YAML Files
```bash
# Commit these
git add apps/web/src/content/pages/*.yml
git commit -m "Update homepage content"
```

#### ⚠️ OPTIONAL: Commit Compiled Files
```bash
# Compiled files can be committed for easier deployment
# OR regenerated during build
git add apps/web/src/lib/content/compiled/*.ts
```

**Recommended `.gitignore`:**
```gitignore
# Optional: Ignore compiled content (regenerate at build time)
# apps/web/src/lib/content/compiled/*.ts
# !apps/web/src/lib/content/compiled/index.ts
# !apps/web/src/lib/content/compiled/fallback.ts
```

---

## Summary

The AI Whisperers content system provides:

✅ **Zero Runtime File I/O**: All content pre-compiled at build time
✅ **Type Safety**: Full TypeScript types with IntelliSense
✅ **Multi-Language Support**: EN/ES with automatic fallback
✅ **Deployment Compatibility**: Works on Render.com, Vercel, etc.
✅ **Developer Experience**: Simple YAML authoring
✅ **Performance**: Fast loading, tree-shakable
✅ **Maintainability**: Centralized content management

**Key Files:**
- Source: `apps/web/src/content/pages/*.yml` (22 YAML files)
- Types: `apps/web/src/types/content.ts` (428 lines)
- Compiler: `scripts/compile-content.js` (341 lines)
- Runtime API: `apps/web/src/lib/content/server-compiled.ts` (142 lines)
- Output: `apps/web/src/lib/content/compiled/*.ts` (44 files)

**Related Documentation:**
- [01-system-architecture.md](./01-system-architecture.md) - System overview
- [18-i18n-context.md](./18-i18n-context.md) - Language switching
- [34-i18n-system.md](./34-i18n-system.md) - Complete i18n guide

---

*Last Updated: October 12, 2025 - Documentation reflects production-ready build-time compilation system with multi-language support.*

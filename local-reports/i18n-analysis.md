# Internationalization (i18n) System Analysis

**Date:** October 3, 2025
**Status:** Partially Implemented (40% Complete) - **ARCHITECTURAL DEBT IDENTIFIED**
**Languages Configured:** English (EN), Spanish (ES)
**Priority:** Fix architecture before creating translations

---

## ⚠️ CRITICAL ARCHITECTURAL ISSUES DISCOVERED

**Update:** October 3, 2025 - Deep Analysis

After detailed code analysis, we discovered that the i18n system is not just missing Spanish content files—**the entire content pipeline is architecturally disconnected from the language system**. Creating Spanish YAML files without fixing these fundamental issues would be **completely ineffective**.

### 🔴 **Architectural Disconnects Found:**

1. **Content Loading Ignores Language** (`src/lib/content/server-compiled.ts:16`)
   - `getPageContent(pageName, language?)` accepts language parameter but **never uses it**
   - Always calls `getCompiledPageContent(pageName)` without language argument
   - Language parameter is essentially decorative

2. **Compilation Strips Language Identifiers** (`scripts/compile-content.js:233`)
   - `homepage-es.yml` → compiled as `homepage.ts` (language suffix removed)
   - Spanish files would **overwrite** English files
   - No language-aware output naming

3. **Content Map Lacks Language Dimension** (`src/lib/content/compiled/index.ts:15-24`)
   - Flat structure: `{ 'homepage': content, 'contact': content }`
   - Should be: `{ 'homepage-en': content, 'homepage-es': content }`
   - No multi-language key support

4. **Server-Side Rendering Bypasses Language State** (`src/app/*/page.tsx`)
   - All pages call `getPageContent('pageName')` without language
   - SSR happens before client-side `useLanguage()` can execute
   - Content baked into HTML at build time (always English)

5. **Client Components Ignore Language Context** (`src/components/pages/*.tsx`)
   - `DynamicHomepage.tsx:18` imports `useLanguage()` but only checks `isLoading`
   - Never reads `language` value to switch content
   - Content passed as static props, no dynamic switching

### 📊 **Impact Assessment:**

```
Current Flow (BROKEN):
User clicks "Español"
  → LanguageContext updates (✅ works)
  → localStorage saves "es" (✅ works)
  → Page components re-render (✅ works)
  → Same English content displays (❌ BROKEN - no content switching)

Root Cause:
Content is loaded server-side at build time with no language awareness,
and client components receive static content with no switching mechanism.
```

### 🎯 **Required Before Spanish Translation:**

**MUST FIX FIRST** (Phase 0 - Technical Debt Resolution):
1. ✅ Make `compile-content.js` language-aware (detect `-es` suffix)
2. ✅ Generate separate compiled files per language (`homepage-en.ts`, `homepage-es.ts`)
3. ✅ Update `contentMap` to multi-language structure
4. ✅ Fix `getPageContent()` to actually use language parameter
5. ✅ Add `getLocalizedPageContent()` to load both EN + ES
6. ✅ Create `useLocalizedContent()` hook for client-side switching
7. ✅ Update all page components to use localized content pattern

**THEN IMPLEMENT** (Phase 1-6 - Content & Integration):
- Create Spanish YAML files
- Test language switching
- Polish UI/UX

---

## Executive Summary

The AI Whisperers website has a **partially implemented** internationalization system with **critical architectural debt**. The UI and state management work perfectly, but the entire content pipeline (YAML → compilation → server loading → client rendering) has **zero language awareness**. The language selector is essentially decorative—it changes state but the architecture cannot respond to that state change. We must rebuild the content loading architecture before creating any Spanish translations, otherwise the translations would never load.

---

## Current Implementation Status

### ✅ **Working Components (40%)**

#### 1. UI Layer - Language Selector
**Location:** `src/components/ui/LanguageToggler.tsx`

- Fully functional dropdown with flag icons
- Shows English (🇺🇸) and Spanish (🇪🇸) options
- Smooth animations and proper UX
- Accessibility labels present

#### 2. State Management
**Location:** `src/lib/i18n/context.tsx`

```typescript
interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  isLoading: boolean
}
```

- React Context API implementation
- localStorage persistence (`ai-whisperers-language` key)
- SSR-safe with browser guards
- Properly typed with TypeScript

#### 3. Type System
**Location:** `src/lib/i18n/types.ts`

```typescript
export type Language = 'en' | 'es'

export const LANGUAGES: Record<Language, LanguageConfig> = {
  en: { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  es: { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' }
}
```

- Clean type definitions
- Recently cleaned up (removed PT, FR)
- Proper language metadata

#### 4. Provider Integration
**Location:** `src/app/layout.tsx`

```tsx
<LanguageProvider>
  <AuthProvider>
    {/* App content */}
  </AuthProvider>
</LanguageProvider>
```

- Wraps entire application
- Available globally via `useLanguage()` hook

---

### ❌ **Missing Components (60%)**

#### 1. **CRITICAL: No Spanish Content Files**

**Current State:**
```
src/content/pages/
├── about.yml         (language: "en")
├── architecture.yml  (language: "en")
├── contact.yml       (language: "en")
├── faq.yml           (language: "en")
├── homepage.yml      (language: "en")
├── privacy.yml       (language: "en")
├── services.yml      (language: "en")
├── solutions.yml     (language: "en")
└── terms.yml         (language: "en")
```

**What's Missing:**
```
❌ about-es.yml
❌ architecture-es.yml
❌ contact-es.yml
❌ faq-es.yml
❌ homepage-es.yml
❌ privacy-es.yml
❌ services-es.yml
❌ solutions-es.yml
❌ terms-es.yml
```

**Impact:** When user switches to Spanish, English content still displays.

---

#### 2. **No Dynamic Content Loading**

**Current Implementation:**
```typescript
// src/lib/content/server.ts
export async function getPageContent(pageName: string): Promise<PageContent> {
  // Always loads English content
  // No language parameter
  // No language detection
}
```

**Required Implementation:**
```typescript
export async function getPageContent(
  pageName: string,
  language: Language = 'en'
): Promise<PageContent> {
  const fileName = language === 'en'
    ? `${pageName}.yml`
    : `${pageName}-${language}.yml`

  // Load language-specific content
}
```

---

#### 3. **Inconsistent Component Placement**

**Pages WITH LanguageToggler:**
- ✅ `src/components/pages/TermsPage.tsx` (line 83)
- ✅ `src/components/pages/PrivacyPage.tsx` (line 82)
- ✅ `src/components/pages/FAQPage.tsx` (line 109)

**Pages WITHOUT LanguageToggler:**
- ❌ `src/components/pages/DynamicHomepage.tsx`
- ❌ `src/components/pages/AboutPage.tsx`
- ❌ `src/components/pages/ContactPage.tsx`
- ❌ `src/components/pages/ServicesPage.tsx`
- ❌ `src/components/pages/SolutionsPage.tsx`
- ❌ `src/components/pages/ArchitecturePage.tsx`

**Problem:** No centralized navigation with consistent language selector.

---

#### 4. **Stale Validation Code**

**Location:** `src/lib/i18n/context.tsx:31`

```typescript
// OUTDATED: Still checks for removed languages
if (saved && ['en', 'es', 'pt', 'fr'].includes(saved)) {
  setLanguageState(saved)
}
```

**Should be:**
```typescript
if (saved && ['en', 'es'].includes(saved)) {
  setLanguageState(saved)
}
```

---

## Architecture Issues

### 1. **Content Compilation Gap**

**Current Flow:**
```
YAML Files (EN only)
  ↓
scripts/compile-content.js
  ↓
src/lib/content/compiled/*.ts (EN only)
  ↓
Pages always load EN content
```

**Required Flow:**
```
YAML Files (EN + ES)
  ↓
scripts/compile-content.js (detect language suffix)
  ↓
src/lib/content/compiled/
  ├── homepage-en.ts
  ├── homepage-es.ts
  ├── contact-en.ts
  └── contact-es.ts
  ↓
Pages load content based on LanguageProvider state
```

### 2. **Server-Client Mismatch**

- **Server:** Content loaded at build time (static)
- **Client:** Language state changes at runtime (dynamic)
- **Gap:** No mechanism to reload content when language changes

**Solution Options:**

**Option A: Client-Side Content Switching (Recommended)**
```typescript
// Compile both EN and ES at build time
// Switch content client-side using useLanguage()

const { language } = useLanguage()
const content = language === 'en' ? contentEN : contentES
```

**Option B: Route-Based i18n**
```
/en/about  → English content
/es/about  → Spanish content
```

---

## Scattering Map

```
┌─────────────────────────────────────────────────────────┐
│ Layer 1: UI Components                    [✅ 100%]      │
├─────────────────────────────────────────────────────────┤
│ - LanguageToggler.tsx                                   │
│ - Dropdown works, flag icons render                     │
│ - EN/ES selection functional                            │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Layer 2: State Management                 [✅ 100%]      │
├─────────────────────────────────────────────────────────┤
│ - LanguageProvider context                              │
│ - localStorage persistence                              │
│ - useLanguage() hook                                    │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Layer 3: Type System                      [⚠️ 90%]       │
├─────────────────────────────────────────────────────────┤
│ - Language types defined                                │
│ - LANGUAGES config clean                                │
│ ⚠️ Stale validation in context.tsx                      │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Layer 4: Content Files                    [❌ 0%]        │
├─────────────────────────────────────────────────────────┤
│ - 9 English YAML files exist                            │
│ ❌ 0 Spanish YAML files exist                           │
│ ❌ No translation workflow                              │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Layer 5: Content Loading                  [❌ 0%]        │
├─────────────────────────────────────────────────────────┤
│ ❌ getPageContent() ignores language                    │
│ ❌ compile-content.js doesn't handle -es.yml            │
│ ❌ No language-aware content resolution                 │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Layer 6: Component Integration            [❌ 30%]       │
├─────────────────────────────────────────────────────────┤
│ - LanguageToggler in 3/9 pages                          │
│ ❌ Not in homepage or main pages                        │
│ ❌ No global navigation integration                     │
└─────────────────────────────────────────────────────────┘
```

---

## Completion Roadmap

### Phase 1: Fix Stale Code (Quick Win)
**Effort:** 5 minutes
**Files:** 1

```typescript
// src/lib/i18n/context.tsx:31
if (saved && ['en', 'es'].includes(saved)) {
  setLanguageState(saved)
}
```

### Phase 2: Create Spanish Content Files
**Effort:** 4-8 hours (translation work)
**Files:** 9 new YAML files

1. Duplicate all `.yml` files as `-es.yml`
2. Translate all content to Spanish
3. Update metadata `language: "es"`

### Phase 3: Update Content Compilation
**Effort:** 2-3 hours
**Files:** `scripts/compile-content.js`

```javascript
// Detect language from filename
const match = fileName.match(/^(.+?)(-[a-z]{2})?\.(yml|yaml)$/)
const pageName = match[1]
const language = match[2] ? match[2].substring(1) : 'en'

// Generate separate compiled files per language
const outputPath = `${pageName}-${language}.ts`
```

### Phase 4: Implement Language-Aware Content Loading
**Effort:** 3-4 hours
**Files:** `src/lib/content/server.ts`, `src/lib/content/server-compiled.ts`

```typescript
export async function getPageContent(
  pageName: string,
  language: Language = 'en'
): Promise<PageContent> {
  const contentKey = `${pageName}-${language}`
  return contentMap[contentKey] || contentMap[`${pageName}-en`]
}
```

### Phase 5: Update All Pages to Use Language Context
**Effort:** 2-3 hours
**Files:** All page components

```tsx
'use client'
import { useLanguage } from '@/lib/i18n/context'

export function DynamicPage({ contentEN, contentES }: Props) {
  const { language } = useLanguage()
  const content = language === 'es' ? contentES : contentEN

  return <PageComponent content={content} />
}
```

### Phase 6: Centralize Language Selector
**Effort:** 1 hour
**Files:** Create global navigation component

```tsx
// src/components/layout/Navigation.tsx
import { LanguageToggler } from '@/components/ui/LanguageToggler'

export function Navigation() {
  return (
    <nav>
      {/* ... nav items ... */}
      <LanguageToggler />
    </nav>
  )
}
```

---

## Recommended Immediate Actions

### 🔴 **Critical (Do First)**
1. Fix stale validation code in `context.tsx`
2. Create at least `homepage-es.yml` for proof of concept
3. Update `getPageContent()` to accept language parameter

### 🟡 **High Priority (Within 1 Week)**
4. Create all 9 Spanish YAML files
5. Update content compilation script
6. Test language switching on homepage

### 🟢 **Medium Priority (Within 2 Weeks)**
7. Centralize LanguageToggler in global navigation
8. Remove redundant LanguageToggler from individual pages
9. Add language-based routing (`/es/`, `/en/`)

---

## Testing Checklist

- [ ] Switch language → Content changes to Spanish
- [ ] Refresh page → Language preference persists
- [ ] All 9 pages have Spanish translations
- [ ] LanguageToggler visible on all pages
- [ ] URL reflects language (optional: `/es/about`)
- [ ] Metadata `<html lang="es">` updates
- [ ] No console errors on language switch
- [ ] Build succeeds with both EN and ES content
- [ ] Docker deployment includes both languages

---

## Conclusion

The internationalization system has solid **infrastructure** (UI, state, types) but lacks **content and integration**. The language selector is essentially decorative—it changes state but doesn't affect what users see.

**Current User Experience:**
1. User clicks "Español 🇪🇸"
2. Dropdown closes, state changes, localStorage updates
3. **Page still shows English content** ❌

**Required User Experience:**
1. User clicks "Español 🇪🇸"
2. Dropdown closes, state changes, localStorage updates
3. **Page content switches to Spanish** ✅

**Estimated Total Effort:** 12-20 hours (mostly translation work)

---

## APPENDIX A: High-Level Configuration Proposals

**Added:** October 3, 2025 - Pre-Implementation Planning

Before implementing the 6-phase roadmap, we need to establish foundational configurations that will support the entire i18n architecture. This appendix details the type system enhancements and environment variable configurations required.

---

### 1. Type System Enhancements

#### 1.1 Update Content Loading Types

**File:** `src/types/content.ts`

**Current State:**
```typescript
// No language parameter support
export interface PageContent {
  meta: MetaData
  // ... other fields
}
```

**Proposed Enhancement:**
```typescript
// Add language-aware interfaces
export interface PageContent {
  meta: MetaData
  language: Language  // NEW: Track content language
  // ... other fields
}

// NEW: Multi-language content loader interface
export interface LocalizedContent<T = PageContent> {
  en: T
  es: T
}

// NEW: Content resolver with language fallback
export interface ContentResolver {
  getContent<T = PageContent>(
    pageName: string,
    language: Language
  ): Promise<T>

  getLocalizedContent(
    pageName: string
  ): Promise<LocalizedContent<PageContent>>
}
```

**Benefits:**
- Type-safe language parameter passing
- Explicit language tracking per content object
- Fallback logic types for missing translations

---

#### 1.2 Enhance i18n Type Definitions

**File:** `src/lib/i18n/types.ts`

**Current State:**
```typescript
export type Language = 'en' | 'es'

export interface LanguageConfig {
  code: Language
  name: string
  nativeName: string
  flag: string
}
```

**Proposed Enhancement:**
```typescript
export type Language = 'en' | 'es'

export interface LanguageConfig {
  code: Language
  name: string
  nativeName: string
  flag: string
  locale: string          // NEW: BCP 47 locale (en-US, es-ES)
  dir: 'ltr' | 'rtl'      // NEW: Text direction
  dateFormat: string      // NEW: Locale date format
  enabled: boolean        // NEW: Feature flag
}

// NEW: Language detection sources
export type LanguageSource =
  | 'url'           // From /es/ route
  | 'localStorage'  // From saved preference
  | 'browser'       // From navigator.language
  | 'default'       // Fallback to DEFAULT_LANGUAGE

// NEW: Language change event
export interface LanguageChangeEvent {
  from: Language
  to: Language
  source: LanguageSource
  timestamp: number
}

export const LANGUAGES: Record<Language, LanguageConfig> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    locale: 'en-US',
    dir: 'ltr',
    dateFormat: 'MM/DD/YYYY',
    enabled: true
  },
  es: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    locale: 'es-ES',
    dir: 'ltr',
    dateFormat: 'DD/MM/YYYY',
    enabled: true
  }
}
```

**Benefits:**
- Locale-specific formatting (dates, numbers)
- RTL support for future languages (Arabic, Hebrew)
- Feature flags to enable/disable languages
- Track language change events for analytics

---

#### 1.3 Fix Stale Validation Code

**File:** `src/lib/i18n/context.tsx`

**Current Bug (Line 31):**
```typescript
// OUTDATED: Still validates removed languages
if (saved && ['en', 'es', 'pt', 'fr'].includes(saved)) {
  setLanguageState(saved)
}
```

**Fix:**
```typescript
// Use dynamic validation from LANGUAGES config
const validLanguages = Object.keys(LANGUAGES) as Language[]
if (saved && validLanguages.includes(saved as Language)) {
  setLanguageState(saved)
}
```

**Benefits:**
- No more stale hardcoded language lists
- Automatically syncs with LANGUAGES config
- Single source of truth

---

### 2. Environment Variable Configuration

#### 2.1 Add i18n Environment Variables

**File:** `.env.example`

**Proposed Additions:**
```bash
# Internationalization (i18n) Configuration
NEXT_PUBLIC_DEFAULT_LANGUAGE="en"
NEXT_PUBLIC_FALLBACK_LANGUAGE="en"
NEXT_PUBLIC_SUPPORTED_LANGUAGES="en,es"
NEXT_PUBLIC_AUTO_DETECT_LANGUAGE="true"
NEXT_PUBLIC_PERSIST_LANGUAGE="true"

# i18n Feature Flags
NEXT_PUBLIC_ENABLE_SPANISH="true"
NEXT_PUBLIC_ENABLE_ROUTE_LOCALE="false"  # Future: /es/about routing
NEXT_PUBLIC_SHOW_LANGUAGE_SELECTOR="true"

# i18n Analytics
NEXT_PUBLIC_TRACK_LANGUAGE_CHANGES="false"
```

**File:** `.env.local` (local development)
```bash
NEXT_PUBLIC_DEFAULT_LANGUAGE="en"
NEXT_PUBLIC_FALLBACK_LANGUAGE="en"
NEXT_PUBLIC_SUPPORTED_LANGUAGES="en,es"
NEXT_PUBLIC_AUTO_DETECT_LANGUAGE="true"
NEXT_PUBLIC_PERSIST_LANGUAGE="true"
NEXT_PUBLIC_ENABLE_SPANISH="true"
NEXT_PUBLIC_ENABLE_ROUTE_LOCALE="false"
NEXT_PUBLIC_SHOW_LANGUAGE_SELECTOR="true"
NEXT_PUBLIC_TRACK_LANGUAGE_CHANGES="false"
```

**File:** `Dockerfile` (build-time args)
```dockerfile
# i18n build arguments
ARG NEXT_PUBLIC_DEFAULT_LANGUAGE="en"
ARG NEXT_PUBLIC_FALLBACK_LANGUAGE="en"
ARG NEXT_PUBLIC_SUPPORTED_LANGUAGES="en,es"
ARG NEXT_PUBLIC_ENABLE_SPANISH="true"

ENV NEXT_PUBLIC_DEFAULT_LANGUAGE=$NEXT_PUBLIC_DEFAULT_LANGUAGE
ENV NEXT_PUBLIC_FALLBACK_LANGUAGE=$NEXT_PUBLIC_FALLBACK_LANGUAGE
ENV NEXT_PUBLIC_SUPPORTED_LANGUAGES=$NEXT_PUBLIC_SUPPORTED_LANGUAGES
ENV NEXT_PUBLIC_ENABLE_SPANISH=$NEXT_PUBLIC_ENABLE_SPANISH
```

---

#### 2.2 Create i18n Config Module

**File:** `src/lib/i18n/config.ts` (NEW)

```typescript
import { Language } from './types'

export const i18nConfig = {
  defaultLanguage: (process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE as Language) || 'en',
  fallbackLanguage: (process.env.NEXT_PUBLIC_FALLBACK_LANGUAGE as Language) || 'en',

  supportedLanguages: (
    process.env.NEXT_PUBLIC_SUPPORTED_LANGUAGES?.split(',') as Language[]
  ) || ['en', 'es'],

  autoDetect: process.env.NEXT_PUBLIC_AUTO_DETECT_LANGUAGE === 'true',
  persist: process.env.NEXT_PUBLIC_PERSIST_LANGUAGE === 'true',

  features: {
    spanish: process.env.NEXT_PUBLIC_ENABLE_SPANISH === 'true',
    routeLocale: process.env.NEXT_PUBLIC_ENABLE_ROUTE_LOCALE === 'true',
    showSelector: process.env.NEXT_PUBLIC_SHOW_LANGUAGE_SELECTOR === 'true',
    trackChanges: process.env.NEXT_PUBLIC_TRACK_LANGUAGE_CHANGES === 'true',
  },

  // Storage keys
  storageKey: 'ai-whisperers-language',

  // Locale mappings
  locales: {
    en: 'en-US',
    es: 'es-ES',
  } as Record<Language, string>,
} as const

// Validation helper
export function isValidLanguage(lang: unknown): lang is Language {
  return typeof lang === 'string' &&
         i18nConfig.supportedLanguages.includes(lang as Language)
}

// Feature flag helpers
export function isLanguageEnabled(lang: Language): boolean {
  if (lang === 'en') return true
  if (lang === 'es') return i18nConfig.features.spanish
  return false
}
```

**Benefits:**
- Centralized i18n configuration
- Environment-based feature flags
- Easy to toggle languages on/off
- Deployment-specific language support

---

#### 2.3 Update ENV_SETUP.md Documentation

**File:** `ENV_SETUP.md`

**Proposed Addition:**
```markdown
## Internationalization (i18n) Variables

| Variable | Purpose | Default | Example |
|----------|---------|---------|---------|
| `NEXT_PUBLIC_DEFAULT_LANGUAGE` | Default UI language | `en` | `en`, `es` |
| `NEXT_PUBLIC_FALLBACK_LANGUAGE` | Language when translation missing | `en` | `en` |
| `NEXT_PUBLIC_SUPPORTED_LANGUAGES` | Comma-separated language codes | `en,es` | `en,es,pt` |
| `NEXT_PUBLIC_AUTO_DETECT_LANGUAGE` | Auto-detect from browser | `true` | `true`, `false` |
| `NEXT_PUBLIC_PERSIST_LANGUAGE` | Save preference to localStorage | `true` | `true`, `false` |
| `NEXT_PUBLIC_ENABLE_SPANISH` | Enable Spanish translations | `true` | `true`, `false` |
| `NEXT_PUBLIC_ENABLE_ROUTE_LOCALE` | Use /es/ route prefixes | `false` | `true`, `false` |
| `NEXT_PUBLIC_SHOW_LANGUAGE_SELECTOR` | Show language toggle UI | `true` | `true`, `false` |
| `NEXT_PUBLIC_TRACK_LANGUAGE_CHANGES` | Analytics for language switches | `false` | `true`, `false` |

### Production Deployment (Render)

Set these environment variables in Render dashboard:

```
NEXT_PUBLIC_DEFAULT_LANGUAGE=en
NEXT_PUBLIC_FALLBACK_LANGUAGE=en
NEXT_PUBLIC_SUPPORTED_LANGUAGES=en,es
NEXT_PUBLIC_ENABLE_SPANISH=true
NEXT_PUBLIC_AUTO_DETECT_LANGUAGE=true
NEXT_PUBLIC_PERSIST_LANGUAGE=true
```
```

---

### 3. Content Compilation Strategy

#### 3.1 Multi-Language File Naming Convention

**Proposed Structure:**
```
src/content/pages/
├── homepage.yml          # English (default)
├── homepage-es.yml       # Spanish
├── contact.yml           # English
├── contact-es.yml        # Spanish
├── about.yml             # English
├── about-es.yml          # Spanish
└── ...
```

**Detection Logic:**
```javascript
// scripts/compile-content.js

const filePattern = /^(.+?)(?:-([a-z]{2}))?\.yml$/

function parseContentFileName(fileName) {
  const match = fileName.match(filePattern)
  return {
    pageName: match[1],       // "homepage"
    language: match[2] || 'en' // "es" or default "en"
  }
}
```

---

#### 3.2 Compiled Output Structure

**Proposed:**
```
src/lib/content/compiled/
├── homepage-en.ts
├── homepage-es.ts
├── contact-en.ts
├── contact-es.ts
├── index.ts              # Export all with language keys
└── fallback.ts
```

**Index Export Pattern:**
```typescript
// src/lib/content/compiled/index.ts (PROPOSED)

import { homepageContentEN } from './homepage-en'
import { homepageContentES } from './homepage-es'
import { contactContentEN } from './contact-en'
import { contactContentES } from './contact-es'

export const contentMap = {
  'homepage-en': homepageContentEN,
  'homepage-es': homepageContentES,
  'contact-en': contactContentEN,
  'contact-es': contactContentES,
  // ... all pages
} as const

export function getCompiledContent(
  pageName: string,
  language: Language
): PageContent {
  const key = `${pageName}-${language}` as keyof typeof contentMap
  return contentMap[key] || contentMap[`${pageName}-en`]
}
```

---

### 4. Server-Client Content Bridge

#### 4.1 Server-Side Content Loader Enhancement

**File:** `src/lib/content/server-compiled.ts`

**Proposed Update:**
```typescript
import type { Language } from '@/lib/i18n/types'
import { i18nConfig } from '@/lib/i18n/config'
import { getCompiledContent } from './compiled'

export async function getPageContent(
  pageName: string,
  language: Language = i18nConfig.defaultLanguage
): Promise<PageContent> {
  try {
    // Try to load language-specific content
    const content = getCompiledContent(pageName, language)

    if (!content) {
      // Fallback to default language
      console.warn(
        `Content for ${pageName}-${language} not found, using fallback`
      )
      return getCompiledContent(pageName, i18nConfig.fallbackLanguage)
    }

    return content
  } catch (error) {
    console.error(`Failed to load content: ${pageName}-${language}`, error)
    throw error
  }
}

// NEW: Load both languages at once (for client-side switching)
export async function getLocalizedPageContent(
  pageName: string
): Promise<LocalizedContent<PageContent>> {
  return {
    en: await getPageContent(pageName, 'en'),
    es: await getPageContent(pageName, 'es'),
  }
}
```

---

#### 4.2 Client-Side Content Switching Hook

**File:** `src/hooks/use-localized-content.ts` (NEW)

```typescript
'use client'

import { useMemo } from 'react'
import { useLanguage } from '@/lib/i18n/context'
import type { PageContent, LocalizedContent } from '@/types/content'

export function useLocalizedContent(
  localizedContent: LocalizedContent<PageContent>
): PageContent {
  const { language } = useLanguage()

  return useMemo(() => {
    return localizedContent[language] || localizedContent.en
  }, [language, localizedContent])
}
```

**Usage in Pages:**
```tsx
// src/app/page.tsx (PROPOSED PATTERN)

export default async function HomePage() {
  // Load both languages at build time
  const localizedContent = await getLocalizedPageContent('homepage')

  return <DynamicHomepage localizedContent={localizedContent} />
}

// src/components/pages/DynamicHomepage.tsx
export function DynamicHomepage({
  localizedContent
}: {
  localizedContent: LocalizedContent<PageContent>
}) {
  // Client-side: Switch content based on language state
  const content = useLocalizedContent(localizedContent)

  return (
    <div>
      <h1>{content.hero.title}</h1>
      {/* Content automatically switches when language changes */}
    </div>
  )
}
```

---

### 5. Implementation Priority

#### Phase 0: Configuration Foundation (NEW - Do This First)

**Estimated Time:** 1-2 hours

1. ✅ Create `src/lib/i18n/config.ts`
2. ✅ Add i18n env variables to `.env.example`
3. ✅ Add i18n env variables to `.env.local`
4. ✅ Update `Dockerfile` with i18n ARGs
5. ✅ Fix stale validation in `context.tsx`
6. ✅ Enhance type definitions in `types.ts`
7. ✅ Add types to `content.ts`
8. ✅ Create `use-localized-content.ts` hook
9. ✅ Update `ENV_SETUP.md` documentation

**Deliverable:** Complete type system and configuration ready for content work.

---

### 6. Testing Strategy

#### 6.1 Environment Variable Tests

```bash
# Test default language
NEXT_PUBLIC_DEFAULT_LANGUAGE=es npm run dev
# Should start with Spanish as default

# Test language disabling
NEXT_PUBLIC_ENABLE_SPANISH=false npm run dev
# Should hide Spanish option in selector

# Test auto-detection
NEXT_PUBLIC_AUTO_DETECT_LANGUAGE=false npm run dev
# Should not detect browser language
```

#### 6.2 Type Safety Checks

```typescript
// Should pass TypeScript compilation
import { getPageContent } from '@/lib/content/server'
import type { Language } from '@/lib/i18n/types'

const lang: Language = 'en' // ✅
const content = await getPageContent('homepage', lang) // ✅

const invalidLang: Language = 'fr' // ❌ Type error
```

---

## Summary of Proposed Changes

### Files to Create (8 new files):
1. `src/lib/i18n/config.ts` - Centralized i18n configuration
2. `src/hooks/use-localized-content.ts` - Content switching hook
3. `src/types/localized.ts` - Localization type interfaces (optional)

### Files to Modify (7 files):
1. `src/lib/i18n/types.ts` - Enhanced type definitions
2. `src/lib/i18n/context.tsx` - Fix stale validation
3. `src/types/content.ts` - Add language field and LocalizedContent
4. `src/lib/content/server-compiled.ts` - Language-aware loading
5. `.env.example` - Add i18n variables
6. `.env.local` - Add i18n variables
7. `Dockerfile` - Add i18n build args
8. `ENV_SETUP.md` - Document i18n configuration

### Environment Variables Added: 9
- `NEXT_PUBLIC_DEFAULT_LANGUAGE`
- `NEXT_PUBLIC_FALLBACK_LANGUAGE`
- `NEXT_PUBLIC_SUPPORTED_LANGUAGES`
- `NEXT_PUBLIC_AUTO_DETECT_LANGUAGE`
- `NEXT_PUBLIC_PERSIST_LANGUAGE`
- `NEXT_PUBLIC_ENABLE_SPANISH`
- `NEXT_PUBLIC_ENABLE_ROUTE_LOCALE`
- `NEXT_PUBLIC_SHOW_LANGUAGE_SELECTOR`
- `NEXT_PUBLIC_TRACK_LANGUAGE_CHANGES`

---

**Configuration Phase Completion Checklist:**
- [ ] All new files created
- [ ] All type definitions updated
- [ ] All environment variables added
- [ ] Stale validation code fixed
- [ ] Documentation updated
- [ ] Type safety verified
- [ ] Environment tests passing

**After Completion:** Ready to proceed with Phase 1-6 from main roadmap.

---

**Report Generated:** October 3, 2025
**Next Review:** After Phase 1-3 completion
**Configuration Proposals Added:** October 3, 2025

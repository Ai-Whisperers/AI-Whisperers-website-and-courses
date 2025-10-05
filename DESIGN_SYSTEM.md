# 🎨 AI Whisperers Design System

**Enterprise-grade design token system with 5-layer context architecture**

Last Updated: October 5, 2025
Version: 1.0.0
Status: ✅ Production Ready

---

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Design Tokens](#design-tokens)
- [Context Layers](#context-layers)
- [Usage Guide](#usage-guide)
- [Migration Guide](#migration-guide)
- [Best Practices](#best-practices)

---

## 🎯 Overview

The AI Whisperers Design System is an enterprise-grade design token system that provides:

- **Type-safe design tokens** across 7 categories
- **Clear separation** between public tokens and private user data
- **Multi-tenancy support** for white-labeling
- **6 theme variants** with dynamic switching
- **Comprehensive token coverage**: Colors, Typography, Spacing, Shadows, Borders, Transitions, Z-Index

### Key Benefits

✨ **Security**: Public design tokens separated from private user preferences
✨ **Performance**: Static tokens are cacheable and optimizable
✨ **Multi-tenancy**: Tenant-specific themes without user data mixing
✨ **Versioning**: Design system independently versionable
✨ **Developer Experience**: Type-safe autocomplete throughout codebase
✨ **Consistency**: Single source of truth for all design decisions

---

## 🏗️ Architecture

### 5-Layer Context System

```
┌─────────────────────────────────────────┐
│  SecurityProvider (Layer 0)             │  ← Authentication, users, permissions
├─────────────────────────────────────────┤
│  LogicProvider (Layer 1)                │  ← Routing, modals, notifications
├─────────────────────────────────────────┤
│  DesignSystemProvider (Layer 2A) 🆕     │  ← PUBLIC: Design tokens, themes
├─────────────────────────────────────────┤
│  PresentationProvider (Layer 2B) ♻️      │  ← PRIVATE: User UI preferences
├─────────────────────────────────────────┤
│  I18nProvider (Layer 3)                 │  ← Language, locale, translations
└─────────────────────────────────────────┘
```

### Layer Responsibilities

#### Layer 2A: DesignSystemProvider (NEW)
**PUBLIC DATA** - Static design tokens accessible to all

- **Tokens**: Colors, typography, spacing, shadows, borders, transitions, z-index
- **Themes**: 6 theme variants (blueProfessional, greenNature, purpleCreative, etc.)
- **Theme Management**: Dynamic theme switching with CSS variables
- **SSR Support**: Server-side rendering safe

```tsx
import { useDesignSystem, useTheme, useTokens } from '@/contexts/design-system'

// Access full design system
const { tokens, currentThemeId, setTheme } = useDesignSystem()

// Shorthand for theme only
const { themeId, theme, setTheme, getAllThemes } = useTheme()

// Shorthand for tokens only
const tokens = useTokens()
```

#### Layer 2B: PresentationProvider (REFACTORED)
**PRIVATE DATA** - User-specific UI preferences (GDPR-compliant)

- **Font Size**: Small, Medium, Large, Extra-large
- **Contrast Mode**: Normal, High, Extra-high
- **Animation Speed**: None, Reduced, Normal, Fast
- **Layout**: Sidebar, compact mode, breadcrumbs, grid density
- **Accessibility**: Reduce motion, high contrast, screen reader, keyboard hints

```tsx
import { usePresentation } from '@/contexts/presentation'

const {
  preferences,
  setFontSize,
  setAnimationSpeed,
  updateAccessibilityPreferences,
} = usePresentation()
```

---

## 🎨 Design Tokens

### Token Categories

#### 1. Colors

**Theme Variants**: 6 themes with 11-shade color scales (50-950)

```typescript
// Available themes
'blueProfessional' | 'greenNature' | 'purpleCreative' |
'orangeSunset' | 'tealOcean' | 'redEnergy'

// Color scales (11 shades each)
primary: { 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950 }
secondary: { 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950 }
accent: { 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950 }
neutral: { 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950 }

// Semantic feedback colors
success, warning, error

// Semantic UI colors
semanticColors.background.primary
semanticColors.text.primary
semanticColors.border.default
semanticColors.interactive.hover
```

**Usage**:

```tsx
// In Tailwind
<div className="bg-primary-500 text-primary-50" />
<div className="bg-neutral-900 border-neutral-700" />

// In CSS
background: var(--color-primary-500);
color: var(--color-text-primary);

// Programmatically
import { useTokens } from '@/contexts/design-system'
const tokens = useTokens()
const primaryColor = tokens.colors.themes.blueProfessional.primary[500]
```

#### 2. Typography

**Font Families**:
```typescript
fontFamily.sans    // System UI fonts
fontFamily.serif   // Serif fonts
fontFamily.mono    // Monospace fonts
fontFamily.heading // Heading font
fontFamily.body    // Body font
```

**Font Sizes**: 2xs, xs, sm, base, lg, xl, 2xl, 3xl, 4xl, 5xl, 6xl, 7xl, 8xl, 9xl

**Font Weights**: thin, extralight, light, normal, medium, semibold, bold, extrabold, black

**Text Presets**:
```typescript
textPresets.displayLarge   // Hero sections
textPresets.h1             // Main heading
textPresets.bodyBase       // Body text
textPresets.buttonBase     // Button text
textPresets.code           // Code snippets
```

**Usage**:

```tsx
// Tailwind
<h1 className="text-5xl font-bold leading-tight" />
<p className="text-base font-normal leading-relaxed" />

// CSS
font-size: var(--font-size-base);
font-weight: var(--font-weight-semibold);
```

#### 3. Spacing

**Scale**: 4px base unit (0.25rem)

```typescript
spacing[1]   // 4px
spacing[2]   // 8px
spacing[4]   // 16px
spacing[8]   // 32px
spacing[12]  // 48px
// ... up to spacing[96]
```

**Semantic Spacing**:
```typescript
semanticSpacing.component.base   // 16px
semanticSpacing.layout.md        // 48px
semanticSpacing.stack.sm         // 16px
semanticSpacing.inset.lg         // 32px
```

**Component Spacing**:
```typescript
componentSpacing.button.paddingX.base  // 16px
componentSpacing.card.padding.base     // 24px
componentSpacing.input.paddingY.base   // 10px
```

**Usage**:

```tsx
// Tailwind
<div className="p-4 m-6 gap-2" />
<div className="px-8 py-4" />

// CSS
padding: var(--spacing-4);
margin: var(--spacing-6);
```

#### 4. Shadows

**Box Shadows**: xs, sm, base, md, lg, xl, 2xl, inner

**Glassmorphism**: sm, base, md, lg

**Elevation Levels**: 0-7

**Usage**:

```tsx
// Tailwind
<div className="shadow-md" />
<div className="shadow-lg" />

// CSS
box-shadow: var(--shadow-base);
```

#### 5. Borders

**Radius**: none, xs, sm, base, md, lg, xl, 2xl, 3xl, full

**Width**: 0, 1, 2, 4, 8

**Usage**:

```tsx
// Tailwind
<div className="rounded-lg border-2" />
<div className="rounded-full border" />
```

#### 6. Transitions

**Duration**: 0, 75, 100, 150, 200, 300, 500, 700, 1000ms

**Timing Functions**: linear, in, out, inOut, spring, bounce

**Presets**:
```typescript
transitionPresets.fast    // Quick interactions (150ms)
transitionPresets.base    // Default (200ms)
transitionPresets.slow    // Smooth (300ms)
transitionPresets.spring  // Bouncy (300ms spring)
```

**Usage**:

```tsx
// Tailwind
<div className="transition-all duration-200 ease-out" />

// CSS
transition: all 200ms ease-out;
```

#### 7. Z-Index

**Layers**: base, raised, dropdown, sticky, fixed, overlay, modal, popover, tooltip, toast, alert

**Usage**:

```tsx
// Tailwind
<div className="z-modal" />    // z-index: 1400
<div className="z-tooltip" />  // z-index: 1600

// CSS
z-index: var(--z-index-modal);
```

---

## 🔧 Usage Guide

### Setting Up the Design System

The design system is already integrated into `RootProvider`. No additional setup needed!

```tsx
// src/contexts/RootProvider.tsx (already configured)
<SecurityProvider>
  <LogicProvider>
    <DesignSystemProvider>     {/* Layer 2A */}
      <PresentationProvider>   {/* Layer 2B */}
        <I18nProvider>
          {children}
        </I18nProvider>
      </PresentationProvider>
    </DesignSystemProvider>
  </LogicProvider>
</SecurityProvider>
```

### Using Hooks

```tsx
import { useDesignSystem, useTheme, useTokens } from '@/contexts/design-system'
import { usePresentation } from '@/contexts/presentation'

function MyComponent() {
  // Access design tokens
  const tokens = useTokens()

  // Access theme
  const { themeId, setTheme, getAllThemes } = useTheme()

  // Access user preferences
  const { preferences, setFontSize } = usePresentation()

  return (
    <div style={{ color: tokens.colors.semantic.text.primary }}>
      Current theme: {themeId}
    </div>
  )
}
```

### Using Tailwind Utilities

All design tokens are available as Tailwind utilities:

```tsx
<div className="
  bg-primary-500
  text-neutral-50
  p-6
  rounded-lg
  shadow-md
  transition-all
  duration-200
  z-dropdown
">
  Styled with design tokens!
</div>
```

### Switching Themes

```tsx
import { useTheme } from '@/contexts/design-system'

function ThemeSwitcher() {
  const { themeId, setTheme, getAllThemes } = useTheme()

  return (
    <select value={themeId} onChange={(e) => setTheme(e.target.value)}>
      {getAllThemes().map(theme => (
        <option key={theme.id} value={theme.id}>
          {theme.name}
        </option>
      ))}
    </select>
  )
}
```

---

## 🔄 Migration Guide

### Migrating from Old System

**Before**:
```tsx
import { COLOR_THEMES } from '@/lib/themes/colorThemes'
import { usePresentation } from '@/contexts/presentation'

const { currentTheme, setTheme } = usePresentation()
```

**After**:
```tsx
import { useTheme } from '@/contexts/design-system'
import { usePresentation } from '@/contexts/presentation'

const { theme, setTheme } = useTheme()
const { preferences } = usePresentation()  // Only user prefs
```

### Key Changes

1. **Theme management moved** from PresentationContext to DesignSystemContext
2. **PresentationContext** now only contains user preferences
3. **New hooks** available: `useTheme()`, `useTokens()`
4. **Color themes** accessed via `useTheme()` instead of `usePresentation()`

---

## ✅ Best Practices

### DO ✅

- **Use design tokens** for all styling (via Tailwind or tokens directly)
- **Use semantic tokens** (e.g., `text-primary`) instead of hardcoded values
- **Use `useTheme()`** for theme management
- **Use `usePresentation()`** for user preferences only
- **Maintain separation** between public tokens and private user data

### DON'T ❌

- **Don't hardcode colors, spacing, or other values** - always use tokens
- **Don't mix theme logic** into PresentationContext (it's in DesignSystemContext now)
- **Don't bypass the token system** - use it for consistency
- **Don't store user data** in DesignSystemContext (it's public!)

### Example: Good vs. Bad

**❌ Bad**:
```tsx
<div style={{ padding: '24px', color: '#3b82f6' }}>
  Hardcoded values
</div>
```

**✅ Good**:
```tsx
<div className="p-6 text-primary-500">
  Using design tokens
</div>
```

---

## 📊 Token Coverage

| Category | Coverage | Status |
|----------|----------|--------|
| Colors | 100% | ✅ Complete |
| Typography | 100% | ✅ Complete |
| Spacing | 100% | ✅ Complete |
| Shadows | 100% | ✅ Complete |
| Borders | 100% | ✅ Complete |
| Transitions | 100% | ✅ Complete |
| Z-Index | 100% | ✅ Complete |

**Overall Coverage**: 100% ✅

---

## 🔗 Related Documentation

- [CLAUDE.md](./CLAUDE.md) - Architecture overview and EC4RO-HGN methodology
- [local-reports/styling-architecture-analysis.md](./local-reports/styling-architecture-analysis.md) - Initial analysis
- [local-reports/design-token-system-refactoring-plan.md](./local-reports/design-token-system-refactoring-plan.md) - Refactoring plan

---

## 🤝 Contributing

When adding new design tokens:

1. Add to appropriate token file in `src/lib/design-system/tokens/`
2. Update Tailwind config if adding new utility categories
3. Update this documentation
4. Increment `DESIGN_TOKEN_VERSION` in `src/lib/design-system/tokens/index.ts`
5. Test with all 6 theme variants

---

**Built with ❤️ by the AI Whisperers Team**

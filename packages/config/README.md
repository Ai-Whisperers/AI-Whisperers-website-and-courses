# @aiwhisperers/config

Shared configuration packages for the AI Whisperers monorepo.

## 📦 Packages

### `@aiwhisperers/config-typescript`

Base TypeScript configuration with strict type checking and modern ESNext features.

**Usage:**
```json
// tsconfig.json
{
  "extends": "@aiwhisperers/config-typescript/tsconfig.base.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src", "next-env.d.ts"],
  "exclude": ["node_modules"]
}
```

**Features:**
- ✅ Strict type checking enabled
- ✅ Modern ESNext target (ES2022)
- ✅ Bundler module resolution
- ✅ JSX support (preserve mode for Next.js)
- ✅ Incremental compilation
- ✅ Source maps and declarations

---

### `@aiwhisperers/config-eslint`

Shared ESLint configuration with Next.js and TypeScript rules.

**Usage:**
```javascript
// .eslintrc.js
module.exports = {
  extends: ['@aiwhisperers/config-eslint'],
  // Add package-specific rules here
}
```

**Features:**
- ✅ Extends Next.js core-web-vitals
- ✅ TypeScript strict rules (@typescript-eslint)
- ✅ React hooks validation
- ✅ Console statement warnings
- ✅ No `any` types enforcement
- ✅ Consistent type imports

---

### `@aiwhisperers/config-prettier`

Shared Prettier configuration for consistent code formatting.

**Usage:**
```javascript
// prettier.config.js
module.exports = require('@aiwhisperers/config-prettier')
```

**Features:**
- ✅ 100 character line width
- ✅ 2 space indentation
- ✅ No semicolons
- ✅ Single quotes
- ✅ ES5 trailing commas
- ✅ Tailwind CSS plugin integration
- ✅ File-type specific overrides (JSON, MD, YAML)

---

### `@aiwhisperers/config-tailwind`

Shared Tailwind CSS configuration with design tokens and theme.

**Usage:**
```javascript
// tailwind.config.js
const baseConfig = require('@aiwhisperers/config-tailwind')

module.exports = {
  ...baseConfig,
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      ...baseConfig.theme.extend,
      // Add app-specific theme extensions
    }
  }
}
```

**Features:**
- ✅ AI Whisperers brand color palette (primary, secondary, accent)
- ✅ Dark mode support (class strategy)
- ✅ Custom font families (Inter, Mono)
- ✅ Extended spacing scale
- ✅ Custom animations (fade, slide)
- ✅ Soft shadow utilities
- ✅ Tailwind plugins: forms, typography, aspect-ratio

**Brand Colors:**
- **Primary**: Blue (`#0ea5e9`) - Main brand color
- **Secondary**: Purple (`#a855f7`) - Secondary brand color
- **Accent**: Orange (`#f97316`) - CTA and highlights

---

## 🚀 Installation

These packages are automatically available in the monorepo workspace. Apps and packages can reference them using workspace protocol:

```json
{
  "dependencies": {
    "@aiwhisperers/config-typescript": "workspace:*",
    "@aiwhisperers/config-eslint": "workspace:*",
    "@aiwhisperers/config-prettier": "workspace:*",
    "@aiwhisperers/config-tailwind": "workspace:*"
  }
}
```

## 📚 Philosophy

These configurations follow these principles:

1. **Strictness**: Enforce strict type checking and code quality
2. **Consistency**: Same rules across all packages and apps
3. **Modern**: Use latest JavaScript/TypeScript features
4. **Performance**: Optimized for build speed and developer experience
5. **Extensibility**: Easy to extend for package-specific needs

## 🔧 Maintenance

When updating these configs:

1. **Breaking Changes**: Bump major version and document migration
2. **New Rules**: Add with warnings first, then errors
3. **Testing**: Test in all apps/packages before committing
4. **Documentation**: Update this README with any changes

---

**Version**: 0.1.0
**Maintainer**: AI Whisperers Team
**Last Updated**: 2025-10-10

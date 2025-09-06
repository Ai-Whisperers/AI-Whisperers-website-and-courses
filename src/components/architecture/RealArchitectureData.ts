// Real Architecture Data based on Latest Codebase Analysis
// Generated from local-reports analysis - Updated September 6, 2025
// Source: EC4RO-HGN Enhanced Graph System with 456+ vertices

interface GraphVertex {
  id: string
  name: string
  description: string
  level: -1 | 0 | 1 | 2
  category: string
  dependencies: string[]
  complexity: 'Low' | 'Medium' | 'High'
  status: 'Active' | 'Development' | 'Planned' | 'Critical'
  icon: string
  position: { x: number; y: number }
  files: string[]
  metrics?: {
    afferentCoupling?: number
    efferentCoupling?: number
    instability?: number
    importance?: 'Critical' | 'High' | 'Medium' | 'Low'
  }
  health?: 'Excellent' | 'Good' | 'Monitor' | 'Refactor'
}

interface GraphLevel {
  level: -1 | 0 | 1 | 2
  title: string
  description: string
  color: string
  vertices: GraphVertex[]
  stats: {
    totalFiles: number
    totalDependencies: number
    qualityScore: number
  }
}

// Enhanced Real System Architecture Data - September 6, 2025
export const realArchitectureData: GraphLevel[] = [
  {
    level: -1,
    title: "Root Orchestration",
    description: "Development Artifacts → Running System Transformation Pipeline",
    color: "from-red-500 to-red-600",
    stats: {
      totalFiles: 15,
      totalDependencies: 12,
      qualityScore: 96
    },
    vertices: [
      {
        id: "git-source-control",
        name: "Git Source Repository",
        description: "GitHub repository with main branch deployment trigger and version control",
        level: -1,
        category: "Source Control",
        dependencies: [],
        complexity: "Low",
        status: "Active",
        icon: "GitBranch",
        position: { x: 5, y: 10 },
        files: [".gitignore", ".git/", "README.md"],
        metrics: { importance: 'Critical', afferentCoupling: 0, efferentCoupling: 3, instability: 1.00 },
        health: 'Excellent'
      },
      {
        id: "package-dependencies",
        name: "NPM Dependency System",
        description: "456 npm packages including Next.js 15.5.2, React 18, TypeScript, Tailwind CSS",
        level: -1,
        category: "Dependencies",
        dependencies: ["git-source-control"],
        complexity: "High",
        status: "Critical",
        icon: "Package",
        position: { x: 20, y: 10 },
        files: ["package.json", "package-lock.json", "node_modules/"],
        metrics: { importance: 'Critical', afferentCoupling: 1, efferentCoupling: 5, instability: 0.83 },
        health: 'Good'
      },
      {
        id: "render-deployment",
        name: "Render Cloud Platform",
        description: "Automated deployment with Docker, environment management, and CDN integration",
        level: -1,
        category: "Infrastructure",
        dependencies: ["git-source-control", "package-dependencies"],
        complexity: "High",
        status: "Active",
        icon: "Cloud",
        position: { x: 40, y: 10 },
        files: ["render.yaml"],
        metrics: { importance: 'Critical', afferentCoupling: 2, efferentCoupling: 2, instability: 0.50 },
        health: 'Excellent'
      },
      {
        id: "build-pipeline",
        name: "Next.js Build System",
        description: "Turbopack dev + production build with SSG, content compilation, optimization",
        level: -1,
        category: "Build",
        dependencies: ["package-dependencies"],
        complexity: "High",
        status: "Active",
        icon: "Zap",
        position: { x: 60, y: 10 },
        files: ["next.config.ts", "scripts/compile-content.js"],
        metrics: { importance: 'High', afferentCoupling: 1, efferentCoupling: 4, instability: 0.80 },
        health: 'Good'
      },
      {
        id: "env-orchestration",
        name: "Environment Configuration",
        description: "JWT secrets, OAuth providers, deployment environments with validation",
        level: -1,
        category: "Configuration",
        dependencies: ["render-deployment"],
        complexity: "Medium",
        status: "Active",
        icon: "Settings",
        position: { x: 80, y: 10 },
        files: [".env.example", ".env", "src/lib/auth/config.ts"],
        metrics: { importance: 'High', afferentCoupling: 1, efferentCoupling: 3, instability: 0.75 },
        health: 'Good'
      },
      {
        id: "content-compilation",
        name: "Build-time Content System",
        description: "YAML → TypeScript compilation, zero runtime I/O, multilingual support",
        level: -1,
        category: "Content Pipeline",
        dependencies: ["build-pipeline"],
        complexity: "High",
        status: "Active",
        icon: "FileCode",
        position: { x: 30, y: 30 },
        files: ["scripts/compile-content.js", "src/content/pages/", "src/lib/content/compiled/"],
        metrics: { importance: 'High', afferentCoupling: 1, efferentCoupling: 8, instability: 0.89 },
        health: 'Good'
      },
      {
        id: "static-asset-pipeline",
        name: "Static Asset Management",
        description: "Image optimization, SVG processing, public asset serving via CDN",
        level: -1,
        category: "Assets",
        dependencies: ["build-pipeline"],
        complexity: "Medium",
        status: "Active",
        icon: "Image",
        position: { x: 50, y: 30 },
        files: ["public/", "public/images/tools/", "next.config.ts:images"],
        metrics: { importance: 'Medium', afferentCoupling: 1, efferentCoupling: 2, instability: 0.67 },
        health: 'Excellent'
      }
    ]
  },
  {
    level: 0,
    title: "Master Architecture",
    description: "Enhanced Clean Architecture - 200+ files across 6 architectural layers",
    color: "from-blue-500 to-blue-600",
    stats: {
      totalFiles: 200,
      totalDependencies: 106,
      qualityScore: 94
    },
    vertices: [
      {
        id: "app-router-layer",
        name: "Next.js App Router (18 files)",
        description: "Server components, route handlers, layouts with static generation",
        level: 0,
        category: "Presentation",
        dependencies: ["content-compilation"],
        complexity: "High",
        status: "Active",
        icon: "Route",
        position: { x: 8, y: 15 },
        files: ["src/app/page.tsx", "src/app/layout.tsx", "src/app/*/page.tsx", "src/app/api/"],
        metrics: { afferentCoupling: 18, efferentCoupling: 25, instability: 0.58, importance: 'Critical' },
        health: 'Excellent'
      },
      {
        id: "component-library",
        name: "React Component System (45 files)",
        description: "Reusable UI components, page components, interactive widgets",
        level: 0,
        category: "Presentation",
        dependencies: ["app-router-layer"],
        complexity: "High",
        status: "Active",
        icon: "Layers",
        position: { x: 25, y: 15 },
        files: ["src/components/ui/", "src/components/pages/", "src/components/interactive/"],
        metrics: { afferentCoupling: 45, efferentCoupling: 15, instability: 0.25, importance: 'High' },
        health: 'Good'
      },
      {
        id: "content-management-system",
        name: "Content Management (35 files)",
        description: "Multilingual content system with build-time compilation",
        level: 0,
        category: "Application",
        dependencies: ["content-compilation"],
        complexity: "High",
        status: "Critical",
        icon: "FileText",
        position: { x: 42, y: 15 },
        files: ["src/lib/content/", "src/content/pages/", "src/types/content.ts"],
        metrics: { afferentCoupling: 20, efferentCoupling: 8, instability: 0.29, importance: 'Critical' },
        health: 'Monitor'
      },
      {
        id: "authentication-system",
        name: "NextAuth.js Authentication (8 files)",
        description: "JWT-based auth with Google/GitHub OAuth, session management",
        level: 0,
        category: "Application",
        dependencies: ["env-orchestration"],
        complexity: "High",
        status: "Active",
        icon: "Shield",
        position: { x: 59, y: 15 },
        files: ["src/lib/auth/", "src/components/auth/", "src/hooks/use-auth.ts"],
        metrics: { afferentCoupling: 8, efferentCoupling: 12, instability: 0.60, importance: 'High' },
        health: 'Good'
      },
      {
        id: "domain-entities",
        name: "Domain Layer (15 files)",
        description: "Pure business logic: Course, User entities + Value Objects (DDD)",
        level: 0,
        category: "Domain",
        dependencies: [],
        complexity: "Medium",
        status: "Active",
        icon: "Brain",
        position: { x: 76, y: 15 },
        files: ["src/domain/entities/", "src/domain/value-objects/", "src/domain/interfaces/"],
        metrics: { afferentCoupling: 15, efferentCoupling: 0, instability: 0.00, importance: 'High' },
        health: 'Excellent'
      },
      {
        id: "i18n-localization",
        name: "Internationalization (12 files)",
        description: "Spanish/Guarani/English support with context + hooks",
        level: 0,
        category: "Application",
        dependencies: ["component-library"],
        complexity: "Medium",
        status: "Active",
        icon: "Globe",
        position: { x: 8, y: 35 },
        files: ["src/lib/i18n/", "src/components/ui/LanguageToggler.tsx"],
        metrics: { afferentCoupling: 12, efferentCoupling: 5, instability: 0.29, importance: 'Medium' },
        health: 'Good'
      },
      {
        id: "api-infrastructure",
        name: "API Infrastructure (12 files)",
        description: "REST endpoints, health checks, course management APIs",
        level: 0,
        category: "Infrastructure",
        dependencies: ["domain-entities", "authentication-system"],
        complexity: "Medium",
        status: "Active",
        icon: "Server",
        position: { x: 25, y: 35 },
        files: ["src/app/api/", "src/app/api/health/", "src/app/api/courses/"],
        metrics: { afferentCoupling: 6, efferentCoupling: 8, instability: 0.57, importance: 'Medium' },
        health: 'Good'
      },
      {
        id: "static-assets",
        name: "Static Assets (18 files)",
        description: "Optimized images, SVGs, fonts, and public resources",
        level: 0,
        category: "Infrastructure",
        dependencies: ["static-asset-pipeline"],
        complexity: "Low",
        status: "Active",
        icon: "Image",
        position: { x: 42, y: 35 },
        files: ["public/", "public/images/tools/", "src/app/favicon.ico"],
        metrics: { afferentCoupling: 2, efferentCoupling: 0, instability: 0.00, importance: 'Low' },
        health: 'Excellent'
      },
      {
        id: "documentation-system",
        name: "Documentation & Analysis (85 files)",
        description: "Technical docs, business docs, architecture reports, course materials",
        level: 0,
        category: "Documentation",
        dependencies: [],
        complexity: "Low",
        status: "Active",
        icon: "BookOpen",
        position: { x: 59, y: 35 },
        files: ["docs/", "local-reports/", "docs/courses/", "docs/business-docs/"],
        metrics: { afferentCoupling: 0, efferentCoupling: 0, instability: 0.00, importance: 'Medium' },
        health: 'Excellent'
      },
      {
        id: "configuration-system",
        name: "Configuration & Build (12 files)",
        description: "Next.js config, TypeScript, Tailwind, ESLint, deployment configs",
        level: 0,
        category: "Infrastructure",
        dependencies: ["build-pipeline"],
        complexity: "Medium",
        status: "Active",
        icon: "Settings",
        position: { x: 76, y: 35 },
        files: ["next.config.ts", "tailwind.config.ts", "tsconfig.json", "eslint.config.mjs"],
        metrics: { afferentCoupling: 3, efferentCoupling: 2, instability: 0.40, importance: 'High' },
        health: 'Good'
      }
    ]
  },
  {
    level: 1,
    title: "Component Sub-Graphs",
    description: "Critical internal components with high coupling analysis",
    color: "from-green-500 to-green-600",
    stats: {
      totalFiles: 45,
      totalDependencies: 62,
      qualityScore: 88
    },
    vertices: [
      {
        id: "content-management-system",
        name: "Content Management System",
        description: "Server-compiled content loading with 20 imports to /types/content",
        level: 1,
        category: "Content",
        dependencies: ["application-layer"],
        complexity: "High",
        status: "Active",
        icon: "FileText",
        position: { x: 15, y: 25 },
        files: ["src/lib/content/server-compiled.ts", "src/types/content.ts"],
        metrics: { afferentCoupling: 20, efferentCoupling: 3, instability: 0.13 }
      },
      {
        id: "nextauth-system",
        name: "NextAuth.js Authentication",
        description: "JWT-based authentication with Google/GitHub OAuth providers",
        level: 1,
        category: "Authentication",
        dependencies: ["application-layer"],
        complexity: "High",
        status: "Active",
        icon: "Key",
        position: { x: 45, y: 25 },
        files: ["src/lib/auth/", "src/components/auth/", "src/hooks/use-auth.ts"],
        metrics: { afferentCoupling: 8, efferentCoupling: 5, instability: 0.38 }
      },
      {
        id: "ui-component-library",
        name: "UI Component Library",
        description: "Shadcn/ui + Radix components with 8 imports to button component",
        level: 1,
        category: "UI",
        dependencies: ["presentation-layer"],
        complexity: "Medium",
        status: "Active",
        icon: "Palette",
        position: { x: 75, y: 25 },
        files: ["src/components/ui/"],
        metrics: { afferentCoupling: 22, efferentCoupling: 4, instability: 0.15 }
      },
      {
        id: "domain-entities",
        name: "Domain Entities & Value Objects",
        description: "Course, User entities + CourseId, Money, Duration value objects",
        level: 1,
        category: "Business",
        dependencies: ["domain-layer"],
        complexity: "Medium",
        status: "Active",
        icon: "Database",
        position: { x: 30, y: 45 },
        files: ["src/domain/entities/", "src/domain/value-objects/"],
        metrics: { afferentCoupling: 9, efferentCoupling: 0, instability: 0.00 }
      },
      {
        id: "i18n-system",
        name: "Internationalization System",
        description: "Spanish/Guarani/English support with context + hooks",
        level: 1,
        category: "Localization",
        dependencies: ["application-layer"],
        complexity: "Medium",
        status: "Active",
        icon: "Globe",
        position: { x: 60, y: 45 },
        files: ["src/lib/i18n/"],
        metrics: { afferentCoupling: 12, efferentCoupling: 2, instability: 0.14 }
      }
    ]
  },
  {
    level: 2,
    title: "Implementation Detail",
    description: "Function-level granularity for performance-critical components",
    color: "from-purple-500 to-purple-600",
    stats: {
      totalFiles: 15,
      totalDependencies: 24,
      qualityScore: 85
    },
    vertices: [
      {
        id: "content-compiler-algorithm",
        name: "YAML Content Compiler",
        description: "Build-time YAML → TypeScript transformation with type validation",
        level: 2,
        category: "Algorithm",
        dependencies: ["content-management-system"],
        complexity: "High",
        status: "Active",
        icon: "Code2",
        position: { x: 20, y: 30 },
        files: ["scripts/compile-content.js:compileContent()"],
        metrics: { afferentCoupling: 1, efferentCoupling: 3, instability: 0.75 }
      },
      {
        id: "server-content-loader",
        name: "Server Content Loader",
        description: "Zero file I/O content loading using static imports",
        level: 2,
        category: "Performance",
        dependencies: ["content-management-system"],
        complexity: "Medium",
        status: "Active",
        icon: "Zap",
        position: { x: 50, y: 30 },
        files: ["src/lib/content/server-compiled.ts:getPageContent()"],
        metrics: { afferentCoupling: 8, efferentCoupling: 1, instability: 0.11 }
      },
      {
        id: "dependency-injection",
        name: "Clean Architecture DI",
        description: "Domain-driven dependency injection patterns",
        level: 2,
        category: "Architecture",
        dependencies: ["domain-entities"],
        complexity: "Medium",
        status: "Active",
        icon: "Share2",
        position: { x: 80, y: 30 },
        files: ["src/domain/interfaces/", "src/domain/use-cases/"],
        metrics: { afferentCoupling: 4, efferentCoupling: 0, instability: 0.00 }
      },
      {
        id: "type-safety-system",
        name: "TypeScript Type Safety",
        description: "Comprehensive type definitions with strict validation",
        level: 2,
        category: "Quality",
        dependencies: ["content-management-system"],
        complexity: "High",
        status: "Active",
        icon: "Shield",
        position: { x: 35, y: 50 },
        files: ["src/types/", "src/lib/content/compiled/"],
        metrics: { afferentCoupling: 20, efferentCoupling: 0, instability: 0.00 }
      },
      {
        id: "auth-jwt-handler",
        name: "JWT Authentication Logic",
        description: "Session management with multiple OAuth provider support",
        level: 2,
        category: "Security",
        dependencies: ["nextauth-system"],
        complexity: "High",
        status: "Active",
        icon: "Lock",
        position: { x: 65, y: 50 },
        files: ["src/lib/auth/config.ts:authOptions"],
        metrics: { afferentCoupling: 3, efferentCoupling: 2, instability: 0.40 }
      }
    ]
  }
]

// Enhanced real system statistics - September 6, 2025
export const systemStats = {
  totalFiles: 215, // Updated count including architecture files
  totalDependencies: 106,
  circularDependencies: 0,
  architectureGrade: "A",
  qualityScore: 94, // Improved with enhanced analysis
  networkDensity: 0.005,
  averageDegree: 1.15,
  maxInDegree: 20, // /types/content still highest
  layers: 6, // Added configuration layer
  modules: 10, // More granular breakdown
  couplingScore: 12, // Improved with better separation
  cohesionScore: 88, // Higher with enhanced modularity
  instabilityIndex: 0.22, // Improved stability
  criticalComponents: 8,
  healthyComponents: 85,
  monitorComponents: 5,
  refactorComponents: 0
}

// Critical component analysis from reports
export const criticalComponents = [
  {
    name: "/types/content",
    imports: 20,
    risk: "High coupling - consider splitting",
    category: "Type System"
  },
  {
    name: "/lib/utils",
    imports: 9,
    risk: "Growing utility module",
    category: "Utilities"
  },
  {
    name: "/lib/content/server",
    imports: 8,
    risk: "Central content orchestrator",
    category: "Content"
  },
  {
    name: "/components/ui/button",
    imports: 8,
    risk: "High reuse (good)",
    category: "UI"
  }
]

// Module health assessment
export const moduleHealth = {
  healthy: [
    "Domain Module (100%)",
    "UI Component Library (98%)", 
    "i18n System (95%)",
    "Infrastructure (88%)",
    "Authentication (86%)"
  ],
  monitor: [
    "Content Management (78%)",
    "Page Components (75%)"
  ],
  refactor: []
}
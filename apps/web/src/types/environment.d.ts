/**
 * Type definitions for environment variables
 * Ensures type safety when accessing process.env
 */

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // ===================================
      // Node.js & Next.js Core
      // ===================================
      /** Node environment (development, production, test) */
      NODE_ENV: 'development' | 'production' | 'test'
      /** Port number for the server */
      PORT?: string

      // ===================================
      // Authentication & Security
      // ===================================
      /** NextAuth secret for session encryption (REQUIRED) */
      NEXTAUTH_SECRET: string
      /** Public URL of the application (REQUIRED) */
      NEXTAUTH_URL: string

      // ===================================
      // Database
      // ===================================
      /** PostgreSQL connection string (REQUIRED) */
      DATABASE_URL: string

      // ===================================
      // OAuth Providers
      // ===================================
      /** Google OAuth Client ID */
      GOOGLE_CLIENT_ID?: string
      /** Google OAuth Client Secret */
      GOOGLE_CLIENT_SECRET?: string
      /** GitHub OAuth Client ID */
      GITHUB_CLIENT_ID?: string
      /** GitHub OAuth Client Secret */
      GITHUB_CLIENT_SECRET?: string

      // ===================================
      // Payment Providers
      // ===================================
      /** Stripe secret key */
      STRIPE_SECRET_KEY?: string
      /** Stripe webhook secret */
      STRIPE_WEBHOOK_SECRET?: string
      /** Stripe currency (USD, EUR, etc.) */
      STRIPE_CURRENCY?: string
      /** Enable Stripe payment links */
      STRIPE_ENABLE_PAYMENT_LINKS?: string
      /** PayPal client ID */
      PAYPAL_CLIENT_ID?: string
      /** PayPal client secret */
      PAYPAL_CLIENT_SECRET?: string

      // ===================================
      // AI Services
      // ===================================
      /** OpenAI API key */
      OPENAI_API_KEY?: string
      /** Anthropic (Claude) API key */
      ANTHROPIC_API_KEY?: string

      // ===================================
      // Email Services
      // ===================================
      /** ConvertKit API key for newsletters */
      CONVERTKIT_API_KEY?: string
      /** Resend API key for transactional emails */
      RESEND_API_KEY?: string

      // ===================================
      // Cloud Storage
      // ===================================
      /** AWS S3 bucket name */
      AWS_S3_BUCKET?: string
      /** AWS access key ID */
      AWS_ACCESS_KEY_ID?: string
      /** AWS secret access key */
      AWS_SECRET_ACCESS_KEY?: string

      // ===================================
      // Analytics
      // ===================================
      /** Google Analytics measurement ID */
      GOOGLE_ANALYTICS_ID?: string

      // ===================================
      // Public Environment Variables
      // (Accessible in browser via NEXT_PUBLIC_ prefix)
      // ===================================

      // Company Information
      NEXT_PUBLIC_COMPANY_NAME?: string
      NEXT_PUBLIC_COMPANY_FULL_NAME?: string
      NEXT_PUBLIC_COMPANY_TAGLINE?: string
      NEXT_PUBLIC_COMPANY_DESCRIPTION?: string

      // Contact Information
      NEXT_PUBLIC_CONTACT_EMAIL?: string
      NEXT_PUBLIC_CONTACT_PHONE?: string
      NEXT_PUBLIC_SUPPORT_EMAIL?: string
      NEXT_PUBLIC_LEGAL_EMAIL?: string
      NEXT_PUBLIC_PRIVACY_EMAIL?: string

      // Office Location
      NEXT_PUBLIC_OFFICE_STREET?: string
      NEXT_PUBLIC_OFFICE_CITY?: string
      NEXT_PUBLIC_OFFICE_ZIP?: string
      NEXT_PUBLIC_OFFICE_COUNTRY?: string

      // Social Media
      NEXT_PUBLIC_GITHUB_URL?: string
      NEXT_PUBLIC_GITHUB_ORG?: string
      NEXT_PUBLIC_LINKEDIN_URL?: string
      NEXT_PUBLIC_TWITTER_URL?: string
      NEXT_PUBLIC_YOUTUBE_URL?: string
      NEXT_PUBLIC_DISCORD_URL?: string
      NEXT_PUBLIC_INSTAGRAM_URL?: string

      // Application Configuration
      NEXT_PUBLIC_BASE_URL?: string

      // Feature Flags
      NEXT_PUBLIC_ENABLE_COURSES?: string
      NEXT_PUBLIC_ENABLE_BLOG?: string
      NEXT_PUBLIC_ENABLE_CAREERS?: string
      NEXT_PUBLIC_ENABLE_HELP_CENTER?: string
      NEXT_PUBLIC_ENABLE_USER_DASHBOARD?: string
      NEXT_PUBLIC_ENABLE_ADMIN_PANEL?: string
      NEXT_PUBLIC_ENABLE_ANALYTICS?: string
      NEXT_PUBLIC_ENABLE_CERTIFICATES?: string
      NEXT_PUBLIC_ENABLE_SOCIAL_AUTH?: string
      NEXT_PUBLIC_ENABLE_EMAIL_AUTH?: string
      NEXT_PUBLIC_ENABLE_2FA?: string
      NEXT_PUBLIC_CHAT_ENABLED?: string
      NEXT_PUBLIC_CERTIFICATE_AVAILABLE?: string
      NEXT_PUBLIC_MOBILE_ACCESS?: string
      NEXT_PUBLIC_LIFETIME_ACCESS?: string
      NEXT_PUBLIC_PHONE_SUPPORT_ENABLED?: string

      // Internationalization (i18n)
      NEXT_PUBLIC_SUPPORTED_LANGUAGES?: string
      NEXT_PUBLIC_DEFAULT_LANGUAGE?: string
      NEXT_PUBLIC_FALLBACK_LANGUAGE?: string
      NEXT_PUBLIC_ENABLE_SPANISH?: string
      NEXT_PUBLIC_ENABLE_ROUTE_LOCALE?: string
      NEXT_PUBLIC_ROUTE_PREFIX?: string
      NEXT_PUBLIC_SHOW_LANGUAGE_SELECTOR?: string
      NEXT_PUBLIC_AUTO_DETECT_LANGUAGE?: string
      NEXT_PUBLIC_PERSIST_LANGUAGE?: string

      // Analytics & Tracking
      NEXT_PUBLIC_TRACK_USER_ENGAGEMENT?: string
      NEXT_PUBLIC_TRACK_COURSE_PROGRESS?: string
      NEXT_PUBLIC_TRACK_LANGUAGE_CHANGES?: string

      // Support Hours
      NEXT_PUBLIC_SUPPORT_HOURS_WEEKDAY?: string
      NEXT_PUBLIC_SUPPORT_HOURS_WEEKEND?: string

      // Refund Policy
      NEXT_PUBLIC_REFUND_WINDOW_DAYS?: string
      NEXT_PUBLIC_REFUND_MAX_PROGRESS_PERCENT?: string

      // Instructor Information
      NEXT_PUBLIC_INSTRUCTOR_NAME?: string
      NEXT_PUBLIC_INSTRUCTOR_TITLE?: string
      NEXT_PUBLIC_INSTRUCTOR_BIO?: string
      NEXT_PUBLIC_INSTRUCTOR_AVATAR?: string
      NEXT_PUBLIC_INSTRUCTOR_LINKEDIN?: string

      // Lead Magnet
      NEXT_PUBLIC_LEAD_MAGNET_TITLE?: string
      NEXT_PUBLIC_LEAD_MAGNET_DESCRIPTION?: string
      NEXT_PUBLIC_LEAD_MAGNET_URL?: string
      NEXT_PUBLIC_LEAD_MAGNET_PAGES?: string

      // Video Platform
      NEXT_PUBLIC_VIDEO_PLATFORM?: string
      NEXT_PUBLIC_VIMEO_BASE_URL?: string

      // Stripe (Public)
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?: string

      // Course: AI Foundations
      NEXT_PUBLIC_COURSE_AI_FOUNDATIONS_PRICE?: string
      NEXT_PUBLIC_COURSE_AI_FOUNDATIONS_CURRENCY?: string
      NEXT_PUBLIC_COURSE_AI_FOUNDATIONS_DURATION?: string
      NEXT_PUBLIC_COURSE_AI_FOUNDATIONS_MODULES?: string
      NEXT_PUBLIC_COURSE_AI_FOUNDATIONS_LESSONS?: string
      NEXT_PUBLIC_COURSE_AI_FOUNDATIONS_PROJECTS?: string

      // Course: AI Web Development
      NEXT_PUBLIC_COURSE_AI_WEB_DEV_PRICE?: string
      NEXT_PUBLIC_COURSE_AI_WEB_DEV_CURRENCY?: string
      NEXT_PUBLIC_COURSE_AI_WEB_DEV_DURATION?: string
      NEXT_PUBLIC_COURSE_AI_WEB_DEV_MODULES?: string
      NEXT_PUBLIC_COURSE_AI_WEB_DEV_LESSONS?: string
      NEXT_PUBLIC_COURSE_AI_WEB_DEV_PROJECTS?: string

      // Course: Applied AI
      NEXT_PUBLIC_COURSE_APPLIED_AI_PRICE?: string
      NEXT_PUBLIC_COURSE_APPLIED_AI_CURRENCY?: string
      NEXT_PUBLIC_COURSE_APPLIED_AI_DURATION?: string
      NEXT_PUBLIC_COURSE_APPLIED_AI_MODULES?: string
      NEXT_PUBLIC_COURSE_APPLIED_AI_LESSONS?: string
      NEXT_PUBLIC_COURSE_APPLIED_AI_PROJECTS?: string

      // Course: Enterprise AI
      NEXT_PUBLIC_COURSE_ENTERPRISE_AI_PRICE?: string
      NEXT_PUBLIC_COURSE_ENTERPRISE_AI_CURRENCY?: string
      NEXT_PUBLIC_COURSE_ENTERPRISE_AI_DURATION?: string
      NEXT_PUBLIC_COURSE_ENTERPRISE_AI_MODULES?: string
      NEXT_PUBLIC_COURSE_ENTERPRISE_AI_LESSONS?: string
      NEXT_PUBLIC_COURSE_ENTERPRISE_AI_PROJECTS?: string
    }
  }
}

// This export is required to make this a module (vs script)
// It allows the global namespace declarations to work properly
export {}

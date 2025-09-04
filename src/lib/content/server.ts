/**
 * Build-time Content Loading System
 * Uses pre-compiled content modules instead of runtime file system access
 * This ensures deployment compatibility and better performance
 */

import type { PageContent } from '@/types/content'
import type { Language } from '@/lib/i18n/types'

// Import the new compiled content system
export { getPageContent, getAllPagesContent, getComponentContent } from './server-compiled'
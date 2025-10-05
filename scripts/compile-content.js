#!/usr/bin/env node

/**
 * Content Compilation Script
 * Compiles all YAML content files into TypeScript modules at build time
 * This eliminates runtime file system access for deployment compatibility
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// Use process.cwd() for more predictable path resolution across environments
const CONTENT_DIR = path.join(process.cwd(), 'src', 'content', 'pages');
const OUTPUT_DIR = path.join(process.cwd(), 'src', 'lib', 'content', 'compiled');

/**
 * Ensure output directory exists
 */
function ensureOutputDir() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
}

/**
 * Replace environment variable placeholders in content
 */
function replaceEnvVariables(content) {
  const contentStr = JSON.stringify(content);
  const replaced = contentStr.replace(/\$\{([A-Z_]+)\}/g, (match, envVar) => {
    const value = process.env[envVar];
    if (!value) {
      console.warn(`⚠️  Environment variable ${envVar} not found, keeping placeholder`);
      return match;
    }
    return value;
  });
  return JSON.parse(replaced);
}

/**
 * Load and parse YAML file
 */
function loadYamlFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const parsed = yaml.load(content);

    if (!parsed) {
      console.warn(`Warning: Empty or invalid YAML in ${filePath}`);
      return null;
    }

    // Replace environment variables in parsed content
    return replaceEnvVariables(parsed);
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Parse filename to extract page name and language
 * Examples:
 *   homepage.yml → { pageName: 'homepage', language: 'en', fullKey: 'homepage-en' }
 *   homepage-es.yml → { pageName: 'homepage', language: 'es', fullKey: 'homepage-es' }
 */
function parseFileName(fileName) {
  // Remove extension first
  const nameWithoutExt = fileName.replace(/\.(yml|yaml)$/, '');

  // Check for language suffix pattern: pagename-XX where XX is 2-letter language code
  const match = nameWithoutExt.match(/^(.+?)-([a-z]{2})$/);

  if (match) {
    // Has language suffix (e.g., "homepage-es")
    return {
      pageName: match[1],      // "homepage"
      language: match[2],       // "es"
      fullKey: nameWithoutExt   // "homepage-es"
    };
  } else {
    // No language suffix, assume English (e.g., "homepage")
    return {
      pageName: nameWithoutExt, // "homepage"
      language: 'en',            // default to English
      fullKey: `${nameWithoutExt}-en` // "homepage-en"
    };
  }
}

/**
 * Generate TypeScript content for a page
 * Now supports multi-language with proper key naming
 */
function generatePageContent(fullKey, pageName, language, content) {
  // Create valid TypeScript variable name from full key
  // e.g., "homepage-en" → "homepage_en"
  const variableName = fullKey.replace(/[-]/g, '_');

  const typescript = `// Auto-generated content file - Do not edit manually
// Generated from: src/content/pages/${pageName}${language === 'en' ? '' : '-' + language}.yml
// Language: ${language.toUpperCase()}

import type { PageContent } from '@/types/content';

export const ${variableName}Content: PageContent = ${JSON.stringify(content, null, 2)} as const;

export default ${variableName}Content;
`;

  return typescript;
}

/**
 * Generate index file that exports all content
 * Now supports multi-language content with language-aware keys
 *
 * @param {Array<{fullKey: string, fileName: string}>} compiledPages - Array of compiled page info
 */
function generateIndexFile(compiledPages) {
  const imports = compiledPages.map(({ fullKey, fileName }) => {
    const variableName = fullKey.replace(/[-]/g, '_');
    return `export { default as ${variableName}Content } from './${fullKey}';`
  }).join('\n');

  const contentMap = compiledPages.map(({ fullKey }) => {
    const variableName = fullKey.replace(/[-]/g, '_');
    return `  '${fullKey}': ${variableName}Content,`
  }).join('\n');

  const typescript = `// Auto-generated content index - Do not edit manually
// Generated from: src/content/pages/*.yml
// Language-aware: Keys include language suffix (e.g., 'homepage-en', 'homepage-es')

import type { PageContent } from '@/types/content';
${compiledPages.map(({ fullKey }) => {
  const variableName = fullKey.replace(/[-]/g, '_');
  return `import { ${variableName}Content } from './${fullKey}';`
}).join('\n')}

export const contentMap: Record<string, PageContent> = {
${contentMap}
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
  const key = \`\${pageName}-\${language}\`;
  return contentMap[key] || contentMap[\`\${pageName}-en\`] || null;
}

// Individual content exports
${imports}
`;

  return typescript;
}

/**
 * Create fallback content generator
 */
function generateFallbackContent() {
  const typescript = `// Auto-generated fallback content - Do not edit manually

import type { PageContent } from '@/types/content';

export function getFallbackPageContent(pageName: string): PageContent {
  return {
    meta: {
      title: \`\${pageName.charAt(0).toUpperCase() + pageName.slice(1)} - AI Whisperers\`,
      description: 'AI education and consulting services',
      keywords: ['AI', 'education', 'courses'],
      language: 'en'
    },
    navigation: {
      brand: { text: 'AI Whisperers' },
      items: [
        { text: 'Home', href: '/' },
        { text: 'Courses', href: '/courses' },
        { text: 'Services', href: '/services' },
        { text: 'About', href: '/about' },
        { text: 'Contact', href: '/contact' }
      ],
      cta: { text: 'Get Started', variant: 'default' }
    },
    hero: {
      title: 'Content Loading...',
      subtitle: 'Please wait while we load the page content',
      description: 'This page is currently loading. If you continue to see this message, there may be an issue with content loading.',
      cta: {
        primary: 'Go Home',
        secondary: 'Contact Support'
      }
    },
    features: {
      differentiators: {
        title: 'Features',
        description: 'Loading content...',
        items: []
      },
      services: {
        title: 'Services',
        description: 'Loading content...',
        departments: [],
        goalStatement: 'Loading content...'
      },
      tools: {
        title: 'Tools',
        items: []
      }
    },
    stats: {
      title: 'Statistics',
      description: 'Loading content...',
      metrics: []
    },
    contact: {
      title: 'Contact',
      description: 'Get in touch with us',
      primaryCta: { text: 'Contact', variant: 'default' },
      secondaryCta: { text: 'Email', variant: 'outline' },
      info: []
    },
    footer: {
      brand: { text: 'AI Whisperers' },
      copyright: '© 2025 AI Whisperers. All rights reserved.'
    }
  } as const;
}
`;

  return typescript;
}

/**
 * Main compilation function
 */
async function compileContent() {
  console.log('🔨 Starting content compilation...');

  // Load environment variables from .env.local if it exists
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    console.log('📋 Loading environment variables from .env.local...');
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').replace(/^["']|["']$/g, '');
          process.env[key] = value;
        }
      }
    });
  }

  // Ensure output directory exists
  ensureOutputDir();
  
  // Get all YAML files
  const yamlFiles = fs.readdirSync(CONTENT_DIR)
    .filter(file => file.endsWith('.yml') || file.endsWith('.yaml'));
  
  console.log(`📁 Found ${yamlFiles.length} content files`);

  const compiledPages = [];

  // Process each YAML file
  for (const fileName of yamlFiles) {
    // Parse filename to extract page name and language
    const { pageName, language, fullKey } = parseFileName(fileName);
    const filePath = path.join(CONTENT_DIR, fileName);

    console.log(`📄 Processing: ${fileName} → ${fullKey} (lang: ${language})`);

    // Load YAML content
    const content = loadYamlFile(filePath);

    if (!content) {
      console.warn(`⚠️  Skipping ${fileName} due to loading error`);
      continue;
    }

    // Validate basic structure
    if (!content.meta || !content.meta.title) {
      console.warn(`⚠️  ${fullKey} missing required meta.title, adding fallback`);
      content.meta = content.meta || {};
      content.meta.title = content.meta.title || `${pageName.charAt(0).toUpperCase() + pageName.slice(1)} - AI Whisperers`;
    }

    if (!content.meta.description) {
      console.warn(`⚠️  ${fullKey} missing meta.description, adding fallback`);
      content.meta.description = 'AI education and consulting services';
    }

    if (!content.meta.keywords) {
      content.meta.keywords = ['AI', 'education'];
    }

    // Set language from parsed filename (overrides YAML if present)
    content.meta.language = language;

    // Generate TypeScript file with language-aware naming
    const typescript = generatePageContent(fullKey, pageName, language, content);
    const outputPath = path.join(OUTPUT_DIR, `${fullKey}.ts`);

    fs.writeFileSync(outputPath, typescript);
    compiledPages.push({ fullKey, fileName, pageName, language });

    console.log(`✅ Compiled: ${fullKey}.ts (${language.toUpperCase()})`);
  }
  
  // Generate index file
  console.log('📝 Generating content index...');
  const indexContent = generateIndexFile(compiledPages);
  fs.writeFileSync(path.join(OUTPUT_DIR, 'index.ts'), indexContent);
  
  // Generate fallback content
  console.log('🛡️  Generating fallback content...');
  const fallbackContent = generateFallbackContent();
  fs.writeFileSync(path.join(OUTPUT_DIR, 'fallback.ts'), fallbackContent);
  
  console.log(`🎉 Content compilation complete! Generated ${compiledPages.length} content modules`);
  console.log(`📦 Output directory: ${OUTPUT_DIR}`);
}

// Run compilation
if (require.main === module) {
  compileContent().catch(error => {
    console.error('❌ Content compilation failed:', error);
    process.exit(1);
  });
}

module.exports = { compileContent };
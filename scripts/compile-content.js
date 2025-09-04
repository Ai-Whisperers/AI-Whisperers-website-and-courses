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
    
    return parsed;
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Generate TypeScript content for a page
 */
function generatePageContent(pageName, content) {
  // Create valid TypeScript variable name from page name
  const variableName = pageName.replace(/[-]/g, '_');
  
  const typescript = `// Auto-generated content file - Do not edit manually
// Generated from: src/content/pages/${pageName}.yml

import type { PageContent } from '@/types/content';

export const ${variableName}Content: PageContent = ${JSON.stringify(content, null, 2)} as const;

export default ${variableName}Content;
`;

  return typescript;
}

/**
 * Generate index file that exports all content
 */
function generateIndexFile(pageNames) {
  const imports = pageNames.map(name => {
    const variableName = name.replace(/[-]/g, '_');
    return `export { default as ${variableName}Content } from './${name}';`
  }).join('\n');
  
  const contentMap = pageNames.map(name => {
    const variableName = name.replace(/[-]/g, '_');
    return `  '${name}': ${variableName}Content,`
  }).join('\n');

  const typescript = `// Auto-generated content index - Do not edit manually
// Generated from: src/content/pages/*.yml

import type { PageContent } from '@/types/content';
${pageNames.map(name => {
  const variableName = name.replace(/[-]/g, '_');
  return `import { ${variableName}Content } from './${name}';`
}).join('\n')}

export const contentMap: Record<string, PageContent> = {
${contentMap}
} as const;

export function getCompiledPageContent(pageName: string): PageContent | null {
  return contentMap[pageName] || null;
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
  
  // Ensure output directory exists
  ensureOutputDir();
  
  // Get all YAML files
  const yamlFiles = fs.readdirSync(CONTENT_DIR)
    .filter(file => file.endsWith('.yml') || file.endsWith('.yaml'));
  
  console.log(`📁 Found ${yamlFiles.length} content files`);
  
  const compiledPages = [];
  
  // Process each YAML file
  for (const fileName of yamlFiles) {
    const pageName = fileName.replace(/\.(yml|yaml)$/, '');
    const filePath = path.join(CONTENT_DIR, fileName);
    
    console.log(`📄 Processing: ${pageName}`);
    
    // Load YAML content
    const content = loadYamlFile(filePath);
    
    if (!content) {
      console.warn(`⚠️  Skipping ${pageName} due to loading error`);
      continue;
    }
    
    // Validate basic structure
    if (!content.meta || !content.meta.title) {
      console.warn(`⚠️  ${pageName} missing required meta.title, adding fallback`);
      content.meta = content.meta || {};
      content.meta.title = content.meta.title || `${pageName.charAt(0).toUpperCase() + pageName.slice(1)} - AI Whisperers`;
    }
    
    if (!content.meta.description) {
      console.warn(`⚠️  ${pageName} missing meta.description, adding fallback`);
      content.meta.description = 'AI education and consulting services';
    }
    
    if (!content.meta.keywords) {
      content.meta.keywords = ['AI', 'education'];
    }
    
    if (!content.meta.language) {
      content.meta.language = 'en';
    }
    
    // Generate TypeScript file
    const typescript = generatePageContent(pageName, content);
    const outputPath = path.join(OUTPUT_DIR, `${pageName}.ts`);
    
    fs.writeFileSync(outputPath, typescript);
    compiledPages.push(pageName);
    
    console.log(`✅ Compiled: ${pageName}.ts`);
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
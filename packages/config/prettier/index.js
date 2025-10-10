/**
 * @aiwhisperers/config-prettier
 * Shared Prettier configuration for AI Whisperers monorepo
 *
 * This configuration enforces consistent code formatting across all packages.
 * It follows modern JavaScript/TypeScript best practices and integrates
 * seamlessly with ESLint and Tailwind CSS.
 */

module.exports = {
  // Line Length
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,

  // Semicolons and Quotes
  semi: false,
  singleQuote: true,
  quoteProps: 'as-needed',

  // JSX
  jsxSingleQuote: false,
  jsxBracketSameLine: false,

  // Trailing Commas
  trailingComma: 'es5',

  // Spacing
  bracketSpacing: true,
  arrowParens: 'always',

  // Line Endings
  endOfLine: 'lf',

  // Embedded Language Formatting
  embeddedLanguageFormatting: 'auto',

  // HTML Whitespace Sensitivity
  htmlWhitespaceSensitivity: 'css',

  // Plugins
  plugins: ['prettier-plugin-tailwindcss'],

  // Overrides for specific file types
  overrides: [
    {
      files: ['*.json', '*.jsonc'],
      options: {
        printWidth: 80,
        trailingComma: 'none',
      },
    },
    {
      files: ['*.md', '*.mdx'],
      options: {
        printWidth: 80,
        proseWrap: 'always',
      },
    },
    {
      files: ['*.yaml', '*.yml'],
      options: {
        printWidth: 80,
      },
    },
  ],
}

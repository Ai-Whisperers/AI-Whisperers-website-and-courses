/**
 * Typography Design Tokens
 * Centralized typography system with semantic naming
 * Font families, sizes, weights, line heights, letter spacing
 */

// Font Family Tokens
export const fontFamily = {
  sans: 'var(--font-sans, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif)',
  serif: 'var(--font-serif, Georgia, Cambria, "Times New Roman", Times, serif)',
  mono: 'var(--font-mono, ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace)',
  heading: 'var(--font-heading, var(--font-sans))',
  body: 'var(--font-body, var(--font-sans))',
} as const

// Font Size Tokens (using rem for scalability)
export const fontSize = {
  // Display sizes (hero sections, large headings)
  '2xs': '0.625rem',    // 10px
  xs: '0.75rem',        // 12px
  sm: '0.875rem',       // 14px
  base: '1rem',         // 16px (baseline)
  lg: '1.125rem',       // 18px
  xl: '1.25rem',        // 20px
  '2xl': '1.5rem',      // 24px
  '3xl': '1.875rem',    // 30px
  '4xl': '2.25rem',     // 36px
  '5xl': '3rem',        // 48px
  '6xl': '3.75rem',     // 60px
  '7xl': '4.5rem',      // 72px
  '8xl': '6rem',        // 96px
  '9xl': '8rem',        // 128px
} as const

// Font Weight Tokens
export const fontWeight = {
  thin: '100',
  extralight: '200',
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
} as const

// Line Height Tokens
export const lineHeight = {
  none: '1',
  tight: '1.25',
  snug: '1.375',
  normal: '1.5',
  relaxed: '1.625',
  loose: '2',
  // Specific sizes for precise control
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
} as const

// Letter Spacing Tokens
export const letterSpacing = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0em',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
} as const

// Text Transform Tokens
export const textTransform = {
  uppercase: 'uppercase',
  lowercase: 'lowercase',
  capitalize: 'capitalize',
  none: 'none',
} as const

// Text Decoration Tokens
export const textDecoration = {
  underline: 'underline',
  overline: 'overline',
  lineThrough: 'line-through',
  none: 'none',
} as const

// Semantic Typography Presets
export const textPresets = {
  // Display styles (hero, landing pages)
  displayLarge: {
    fontSize: fontSize['7xl'],
    fontWeight: fontWeight.black,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.tight,
    fontFamily: fontFamily.heading,
  },
  displayMedium: {
    fontSize: fontSize['6xl'],
    fontWeight: fontWeight.extrabold,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.tight,
    fontFamily: fontFamily.heading,
  },
  displaySmall: {
    fontSize: fontSize['5xl'],
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.snug,
    letterSpacing: letterSpacing.normal,
    fontFamily: fontFamily.heading,
  },

  // Heading styles
  h1: {
    fontSize: fontSize['4xl'],
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.tight,
    fontFamily: fontFamily.heading,
  },
  h2: {
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.snug,
    letterSpacing: letterSpacing.tight,
    fontFamily: fontFamily.heading,
  },
  h3: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.snug,
    letterSpacing: letterSpacing.normal,
    fontFamily: fontFamily.heading,
  },
  h4: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.normal,
    fontFamily: fontFamily.heading,
  },
  h5: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.normal,
    fontFamily: fontFamily.heading,
  },
  h6: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.wide,
    fontFamily: fontFamily.heading,
    textTransform: textTransform.uppercase,
  },

  // Body text styles
  bodyLarge: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.normal,
    lineHeight: lineHeight.relaxed,
    letterSpacing: letterSpacing.normal,
    fontFamily: fontFamily.body,
  },
  bodyBase: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.normal,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.normal,
    fontFamily: fontFamily.body,
  },
  bodySmall: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.normal,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.normal,
    fontFamily: fontFamily.body,
  },

  // UI text styles
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.wide,
    fontFamily: fontFamily.body,
  },
  caption: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.normal,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.normal,
    fontFamily: fontFamily.body,
  },
  overline: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.widest,
    fontFamily: fontFamily.body,
    textTransform: textTransform.uppercase,
  },

  // Code/monospace styles
  code: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.normal,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.normal,
    fontFamily: fontFamily.mono,
  },
  codeBlock: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.normal,
    lineHeight: lineHeight.relaxed,
    letterSpacing: letterSpacing.normal,
    fontFamily: fontFamily.mono,
  },

  // Button text styles
  buttonLarge: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.none,
    letterSpacing: letterSpacing.wide,
    fontFamily: fontFamily.body,
  },
  buttonBase: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.none,
    letterSpacing: letterSpacing.wide,
    fontFamily: fontFamily.body,
  },
  buttonSmall: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.none,
    letterSpacing: letterSpacing.wide,
    fontFamily: fontFamily.body,
  },

  // Link styles
  link: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.normal,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.normal,
    fontFamily: fontFamily.body,
    textDecoration: textDecoration.underline,
  },
  linkSubtle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.normal,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.normal,
    fontFamily: fontFamily.body,
    textDecoration: textDecoration.none,
  },
} as const

// User preference font size multipliers
export const fontSizeMultipliers = {
  small: 0.875,    // 87.5%
  medium: 1,       // 100% (default)
  large: 1.125,    // 112.5%
  extraLarge: 1.25 // 125%
} as const

export type FontSizePreference = keyof typeof fontSizeMultipliers

// Helper to apply font size preference
export function applyFontSizePreference(
  baseSize: string,
  preference: FontSizePreference = 'medium'
): string {
  const multiplier = fontSizeMultipliers[preference]
  // Extract numeric value and unit
  const match = baseSize.match(/^([\d.]+)(.*)$/)
  if (!match) return baseSize

  const [, value, unit] = match
  const newValue = parseFloat(value) * multiplier

  return `${newValue}${unit}`
}

// Export types
export type FontFamily = keyof typeof fontFamily
export type FontSize = keyof typeof fontSize
export type FontWeight = keyof typeof fontWeight
export type LineHeight = keyof typeof lineHeight
export type LetterSpacing = keyof typeof letterSpacing
export type TextPreset = keyof typeof textPresets

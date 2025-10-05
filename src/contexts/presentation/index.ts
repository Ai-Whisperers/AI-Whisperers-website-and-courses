/**
 * Presentation Context - Layer 2
 * UI, Themes, Styling, Accessibility
 */

export { PresentationProvider } from './PresentationProvider'
export {
  PresentationContext,
  usePresentationContext,
  useTheme,
  useUIPreferences,
  useAccessibility,
} from './PresentationContext'

export type {
  ThemeMode,
  FontSize,
  ContrastMode,
  AnimationSpeed,
  LayoutPreferences,
  AccessibilityPreferences,
  UIPreferences,
  PresentationContextState,
} from './types'

export { DEFAULT_UI_PREFERENCES, FONT_SIZE_MAP, ANIMATION_SPEED_MAP } from './types'

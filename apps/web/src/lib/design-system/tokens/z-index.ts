/**
 * Z-Index Design Tokens
 * Centralized z-index layering system for stacking contexts
 */

// Z-index layer system
export const zIndex = {
  // Base layers (content)
  base: 0,

  // Slightly elevated content
  raised: 10,

  // Dropdowns, tooltips
  dropdown: 1000,

  // Sticky headers, fixed navigation
  sticky: 1100,

  // Fixed elements (sidebars, toolbars)
  fixed: 1200,

  // Overlays (modal backdrops)
  overlay: 1300,

  // Modals, dialogs
  modal: 1400,

  // Popovers above modals
  popover: 1500,

  // Tooltips
  tooltip: 1600,

  // Toast notifications
  toast: 1700,

  // Critical alerts (always on top)
  alert: 1800,

  // Debug overlays (development only)
  debug: 9999,
} as const

// Semantic z-index layers
export const semanticZIndex = {
  // Content layers
  content: {
    base: zIndex.base,
    raised: zIndex.raised,
  },

  // Interactive layers
  interactive: {
    dropdown: zIndex.dropdown,
    popover: zIndex.popover,
    tooltip: zIndex.tooltip,
  },

  // Layout layers
  layout: {
    sticky: zIndex.sticky,
    fixed: zIndex.fixed,
  },

  // Overlay layers
  overlay: {
    backdrop: zIndex.overlay,
    modal: zIndex.modal,
  },

  // Notification layers
  notification: {
    toast: zIndex.toast,
    alert: zIndex.alert,
  },
} as const

// Component-specific z-index values
export const componentZIndex = {
  navbar: zIndex.sticky,
  sidebar: zIndex.fixed,
  dropdown: zIndex.dropdown,
  modalBackdrop: zIndex.overlay,
  modalContent: zIndex.modal,
  popover: zIndex.popover,
  tooltip: zIndex.tooltip,
  toast: zIndex.toast,
  contextMenu: zIndex.dropdown,
  select: zIndex.dropdown,
  datePicker: zIndex.dropdown,
  drawer: zIndex.modal,
} as const

// Helper to get relative z-index (offset from base layer)
export function getRelativeZIndex(baseLayer: keyof typeof zIndex, offset: number = 0): number {
  return zIndex[baseLayer] + offset
}

// Export types
export type ZIndex = keyof typeof zIndex
export type ComponentZIndex = keyof typeof componentZIndex

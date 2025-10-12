/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeSelector, FloatingThemeSelector } from '../ThemeSelector'

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  ChevronDown: ({ className }: { className?: string }) => (
    <span data-testid="chevron-down-icon" className={className} />
  ),
  Palette: ({ className }: { className?: string }) => (
    <span data-testid="palette-icon" className={className} />
  ),
}))

// Mock presentation context
const mockSetTheme = jest.fn()
const mockThemes = {
  default: {
    id: 'default',
    name: 'Default Blue',
    description: 'Classic professional blue theme',
    primary: { 500: '#3b82f6' },
    secondary: { 500: '#8b5cf6' },
    accent: { 500: '#06b6d4' },
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Green',
    description: 'Fresh and vibrant green theme',
    primary: { 500: '#10b981' },
    secondary: { 500: '#14b8a6' },
    accent: { 500: '#06b6d4' },
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset Orange',
    description: 'Warm sunset-inspired theme',
    primary: { 500: '#f97316' },
    secondary: { 500: '#ef4444' },
    accent: { 500: '#eab308' },
  },
}

jest.mock('@/contexts/presentation', () => ({
  useTheme: () => ({
    currentTheme: mockThemes.default,
    setTheme: mockSetTheme,
    availableThemes: mockThemes,
  }),
}))

describe('ThemeSelector', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Basic Rendering', () => {
    it('renders the theme selector button', () => {
      render(<ThemeSelector />)
      expect(screen.getByRole('button', { name: /select color theme/i })).toBeInTheDocument()
    })

    it('displays current theme name', () => {
      render(<ThemeSelector />)
      expect(screen.getByText('Default Blue')).toBeInTheDocument()
    })

    it('renders palette icon', () => {
      render(<ThemeSelector />)
      expect(screen.getByTestId('palette-icon')).toBeInTheDocument()
    })

    it('renders chevron icon', () => {
      render(<ThemeSelector />)
      expect(screen.getByTestId('chevron-down-icon')).toBeInTheDocument()
    })
  })

  describe('Dropdown Interaction', () => {
    it('opens dropdown when button is clicked', async () => {
      const user = userEvent.setup()
      render(<ThemeSelector />)

      const button = screen.getByRole('button', { name: /select color theme/i })
      await user.click(button)

      // Check that all themes are displayed (note: Default Blue appears twice - in button and dropdown)
      expect(screen.getAllByText('Default Blue').length).toBeGreaterThanOrEqual(1)
      expect(screen.getByText('Emerald Green')).toBeInTheDocument()
      expect(screen.getByText('Sunset Orange')).toBeInTheDocument()
    })

    it('shows theme descriptions in dropdown', async () => {
      const user = userEvent.setup()
      render(<ThemeSelector />)

      const button = screen.getByRole('button', { name: /select color theme/i })
      await user.click(button)

      expect(screen.getByText('Classic professional blue theme')).toBeInTheDocument()
      expect(screen.getByText('Fresh and vibrant green theme')).toBeInTheDocument()
      expect(screen.getByText('Warm sunset-inspired theme')).toBeInTheDocument()
    })

    it('closes dropdown when backdrop is clicked', async () => {
      const user = userEvent.setup()
      render(<ThemeSelector />)

      // Open dropdown
      const button = screen.getByRole('button', { name: /select color theme/i })
      await user.click(button)

      // Find and click backdrop
      const backdrop = document.querySelector('.fixed.inset-0')
      expect(backdrop).toBeInTheDocument()

      if (backdrop) {
        await user.click(backdrop as HTMLElement)
      }

      // Theme descriptions should no longer be visible (only current theme name)
      expect(screen.queryByText('Classic professional blue theme')).not.toBeInTheDocument()
    })

    it('toggles dropdown on button click', async () => {
      const user = userEvent.setup()
      render(<ThemeSelector />)

      const button = screen.getByRole('button', { name: /select color theme/i })

      // Open
      await user.click(button)
      expect(screen.getByText('Classic professional blue theme')).toBeInTheDocument()

      // Close
      await user.click(button)
      expect(screen.queryByText('Classic professional blue theme')).not.toBeInTheDocument()
    })
  })

  describe('Theme Selection', () => {
    it('calls setTheme when a theme is selected', async () => {
      const user = userEvent.setup()
      render(<ThemeSelector />)

      // Open dropdown
      const button = screen.getByRole('button', { name: /select color theme/i })
      await user.click(button)

      // Click on Emerald theme
      const emeraldButton = screen.getByText('Emerald Green').closest('button')
      if (emeraldButton) {
        await user.click(emeraldButton)
      }

      expect(mockSetTheme).toHaveBeenCalledTimes(1)
      expect(mockSetTheme).toHaveBeenCalledWith('emerald')
    })

    it('closes dropdown after theme selection', async () => {
      const user = userEvent.setup()
      render(<ThemeSelector />)

      // Open dropdown
      const button = screen.getByRole('button', { name: /select color theme/i })
      await user.click(button)

      // Select a theme
      const sunsetButton = screen.getByText('Sunset Orange').closest('button')
      if (sunsetButton) {
        await user.click(sunsetButton)
      }

      // Dropdown should be closed
      expect(screen.queryByText('Warm sunset-inspired theme')).not.toBeInTheDocument()
    })
  })

  describe('Visual Indicators', () => {
    it('shows color preview circles for each theme', async () => {
      const user = userEvent.setup()
      render(<ThemeSelector />)

      // Open dropdown
      const button = screen.getByRole('button', { name: /select color theme/i })
      await user.click(button)

      // Check for color preview divs
      const colorPreviews = document.querySelectorAll('.w-4.h-4.rounded-full')
      // 3 themes × 3 colors each = 9 color preview circles
      expect(colorPreviews.length).toBe(9)
    })

    it('highlights currently selected theme', async () => {
      const user = userEvent.setup()
      render(<ThemeSelector />)

      // Open dropdown
      const button = screen.getByRole('button', { name: /select color theme/i })
      await user.click(button)

      // Find the currently selected theme (default) - there will be multiple "Default Blue" texts
      const defaultBlueTexts = screen.getAllByText('Default Blue')
      // The second one should be in the dropdown
      const selectedThemeButton = defaultBlueTexts[1]?.closest('button')
      expect(selectedThemeButton).toHaveClass('bg-gray-50')
    })

    it('shows selected indicator dot for current theme', async () => {
      const user = userEvent.setup()
      render(<ThemeSelector />)

      // Open dropdown
      const button = screen.getByRole('button', { name: /select color theme/i })
      await user.click(button)

      // Check for blue indicator dot (only one should exist)
      const indicators = document.querySelectorAll('.w-2.h-2.bg-blue-500.rounded-full')
      expect(indicators.length).toBe(1)
    })

    it('rotates chevron icon when dropdown is open', async () => {
      const user = userEvent.setup()
      const { container } = render(<ThemeSelector />)

      const button = screen.getByRole('button', { name: /select color theme/i })

      // Check that rotation class is not initially present
      expect(container.querySelector('.rotate-180')).not.toBeInTheDocument()

      // Open dropdown
      await user.click(button)

      // Should have rotation class after opening
      expect(container.querySelector('.rotate-180')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper aria-label on button', () => {
      render(<ThemeSelector />)
      const button = screen.getByRole('button', { name: /select color theme/i })
      expect(button).toHaveAttribute('aria-label', 'Select color theme')
    })

    it('renders as a button element', () => {
      render(<ThemeSelector />)
      const button = screen.getByRole('button', { name: /select color theme/i })
      expect(button.tagName).toBe('BUTTON')
    })
  })
})

describe('FloatingThemeSelector', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Basic Rendering', () => {
    it('renders in expanded state by default', () => {
      render(<FloatingThemeSelector />)
      expect(screen.getByText('Theme Tester')).toBeInTheDocument()
    })

    it('renders ThemeSelector component when expanded', () => {
      render(<FloatingThemeSelector />)
      expect(screen.getByText('Default Blue')).toBeInTheDocument()
    })
  })

  describe('Minimize/Maximize', () => {
    it('minimizes when minimize button is clicked', async () => {
      const user = userEvent.setup()
      render(<FloatingThemeSelector />)

      const minimizeButton = screen.getByRole('button', { name: /minimize theme selector/i })
      await user.click(minimizeButton)

      expect(screen.queryByText('Theme Tester')).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: /open theme selector/i })).toBeInTheDocument()
    })

    it('maximizes when minimized button is clicked', async () => {
      const user = userEvent.setup()
      render(<FloatingThemeSelector />)

      // First minimize
      const minimizeButton = screen.getByRole('button', { name: /minimize theme selector/i })
      await user.click(minimizeButton)

      // Then maximize
      const maximizeButton = screen.getByRole('button', { name: /open theme selector/i })
      await user.click(maximizeButton)

      expect(screen.getByText('Theme Tester')).toBeInTheDocument()
    })

    it('renders palette icon when minimized', async () => {
      const user = userEvent.setup()
      render(<FloatingThemeSelector />)

      const minimizeButton = screen.getByRole('button', { name: /minimize theme selector/i })
      await user.click(minimizeButton)

      const paletteIcons = screen.getAllByTestId('palette-icon')
      expect(paletteIcons.length).toBeGreaterThan(0)
    })
  })

  describe('Positioning', () => {
    it('is positioned fixed at bottom-right', () => {
      const { container } = render(<FloatingThemeSelector />)
      const floatingDiv = container.querySelector('.fixed.bottom-4.right-4')
      expect(floatingDiv).toBeInTheDocument()
    })

    it('has high z-index for visibility', () => {
      const { container } = render(<FloatingThemeSelector />)
      const floatingDiv = container.querySelector('.z-50')
      expect(floatingDiv).toBeInTheDocument()
    })
  })

  describe('Opacity Effects', () => {
    it('applies reduced opacity when minimized', async () => {
      const user = userEvent.setup()
      const { container } = render(<FloatingThemeSelector />)

      const minimizeButton = screen.getByRole('button', { name: /minimize theme selector/i })
      await user.click(minimizeButton)

      const floatingDiv = container.querySelector('.opacity-30')
      expect(floatingDiv).toBeInTheDocument()
    })

    it('has hover opacity increase when minimized', async () => {
      const user = userEvent.setup()
      const { container } = render(<FloatingThemeSelector />)

      const minimizeButton = screen.getByRole('button', { name: /minimize theme selector/i })
      await user.click(minimizeButton)

      const floatingDiv = container.querySelector('.hover\\:opacity-100')
      expect(floatingDiv).toBeInTheDocument()
    })
  })
})

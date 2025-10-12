/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { StatsCard } from '../StatsCard'

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: React.forwardRef<HTMLDivElement, any>(({ children, ...props }, ref) => (
      <div ref={ref} {...props}>
        {children}
      </div>
    )),
  },
}))

// Mock DynamicIcon component
jest.mock('@/components/content/DynamicIcon', () => ({
  DynamicIcon: ({ name, className }: { name: string; className?: string }) => (
    <span data-testid={`icon-${name}`} className={className}>
      {name}
    </span>
  ),
}))

describe('StatsCard', () => {
  describe('Basic Rendering', () => {
    it('renders label and value correctly', () => {
      render(
        <StatsCard
          label="Total Courses"
          value={15}
          icon="BookOpen"
        />
      )

      expect(screen.getByText('Total Courses')).toBeInTheDocument()
      expect(screen.getByText('15')).toBeInTheDocument()
    })

    it('renders with string value', () => {
      render(
        <StatsCard
          label="Status"
          value="Active"
          icon="CheckCircle"
        />
      )

      expect(screen.getByText('Active')).toBeInTheDocument()
    })

    it('renders icon with default color', () => {
      render(
        <StatsCard
          label="Courses"
          value={10}
          icon="BookOpen"
        />
      )

      const icon = screen.getByTestId('icon-BookOpen')
      expect(icon).toBeInTheDocument()
    })
  })

  describe('Color Variants', () => {
    it('applies blue color class', () => {
      const { container } = render(
        <StatsCard
          label="Blue Stat"
          value={100}
          icon="Activity"
          color="blue"
        />
      )

      const iconContainer = container.querySelector('.bg-blue-500\\/10')
      expect(iconContainer).toBeInTheDocument()
    })

    it('applies green color class', () => {
      const { container } = render(
        <StatsCard
          label="Green Stat"
          value={100}
          icon="Check"
          color="green"
        />
      )

      const iconContainer = container.querySelector('.bg-green-500\\/10')
      expect(iconContainer).toBeInTheDocument()
    })

    it('applies purple color class', () => {
      const { container } = render(
        <StatsCard
          label="Purple Stat"
          value={100}
          icon="Star"
          color="purple"
        />
      )

      const iconContainer = container.querySelector('.bg-purple-500\\/10')
      expect(iconContainer).toBeInTheDocument()
    })

    it('applies orange color class', () => {
      const { container } = render(
        <StatsCard
          label="Orange Stat"
          value={100}
          icon="Flame"
          color="orange"
        />
      )

      const iconContainer = container.querySelector('.bg-orange-500\\/10')
      expect(iconContainer).toBeInTheDocument()
    })
  })

  describe('Trend Display', () => {
    it('displays upward trend correctly', () => {
      render(
        <StatsCard
          label="Revenue"
          value={50000}
          icon="DollarSign"
          trend={{ value: 12.5, direction: 'up' }}
        />
      )

      expect(screen.getByText('12.5%')).toBeInTheDocument()
      expect(screen.getByTestId('icon-TrendingUp')).toBeInTheDocument()
    })

    it('displays downward trend correctly', () => {
      render(
        <StatsCard
          label="Errors"
          value={5}
          icon="AlertTriangle"
          trend={{ value: 8.3, direction: 'down' }}
        />
      )

      expect(screen.getByText('8.3%')).toBeInTheDocument()
      expect(screen.getByTestId('icon-TrendingDown')).toBeInTheDocument()
    })

    it('displays negative trend values correctly', () => {
      render(
        <StatsCard
          label="Stat"
          value={100}
          icon="Activity"
          trend={{ value: -5, direction: 'down' }}
        />
      )

      // Math.abs converts -5 to 5
      expect(screen.getByText('5%')).toBeInTheDocument()
    })

    it('does not display trend when not provided', () => {
      const { container } = render(
        <StatsCard
          label="Simple Stat"
          value={42}
          icon="Hash"
        />
      )

      expect(screen.queryByTestId('icon-TrendingUp')).not.toBeInTheDocument()
      expect(screen.queryByTestId('icon-TrendingDown')).not.toBeInTheDocument()
      expect(container.querySelector('.text-green-600')).not.toBeInTheDocument()
      expect(container.querySelector('.text-red-600')).not.toBeInTheDocument()
    })
  })

  describe('Dark Mode Styles', () => {
    it('includes dark mode classes', () => {
      const { container } = render(
        <StatsCard
          label="Dark Mode Test"
          value={999}
          icon="Moon"
        />
      )

      const card = container.querySelector('.dark\\:bg-gray-800')
      expect(card).toBeInTheDocument()
    })
  })

  describe('Layout and Structure', () => {
    it('renders with correct structure', () => {
      render(
        <StatsCard
          label="Test Label"
          value="Test Value"
          icon="TestIcon"
        />
      )

      // Check that label and value are present in correct order
      const label = screen.getByText('Test Label')
      const value = screen.getByText('Test Value')

      expect(label).toBeInTheDocument()
      expect(value).toBeInTheDocument()

      // Value should have larger text class
      expect(value).toHaveClass('text-3xl')
      expect(value).toHaveClass('font-bold')
    })

    it('renders icon with correct size class', () => {
      render(
        <StatsCard
          label="Icon Size Test"
          value={100}
          icon="Circle"
        />
      )

      const icon = screen.getByTestId('icon-Circle')
      expect(icon).toHaveClass('w-6')
      expect(icon).toHaveClass('h-6')
    })
  })

  describe('Complex Scenarios', () => {
    it('renders all features together', () => {
      render(
        <StatsCard
          label="Complete Stats"
          value={12345}
          icon="TrendingUp"
          color="green"
          trend={{ value: 23.7, direction: 'up' }}
        />
      )

      expect(screen.getByText('Complete Stats')).toBeInTheDocument()
      expect(screen.getByText('12345')).toBeInTheDocument()
      expect(screen.getByText('23.7%')).toBeInTheDocument()
      // Should have 2 TrendingUp icons - one for trend, one for main icon
      expect(screen.getAllByTestId('icon-TrendingUp')).toHaveLength(2)
    })

    it('handles zero values', () => {
      render(
        <StatsCard
          label="Zero Value"
          value={0}
          icon="Circle"
        />
      )

      expect(screen.getByText('0')).toBeInTheDocument()
    })

    it('handles large numbers', () => {
      render(
        <StatsCard
          label="Large Number"
          value={9999999}
          icon="Hash"
        />
      )

      expect(screen.getByText('9999999')).toBeInTheDocument()
    })
  })
})

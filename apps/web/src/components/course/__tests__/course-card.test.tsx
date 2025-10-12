/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CourseCard } from '../course-card'
import type { CourseCardProps } from '../course-card'

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  )
})

// Mock utility functions
jest.mock('@/lib/utils', () => ({
  formatCurrency: (amount: number, currency: string) => `${currency} ${amount}`,
  formatDuration: (minutes: number) => `${minutes} minutes`,
  truncateText: (text: string, length: number) =>
    text.length > length ? `${text.substring(0, length)}...` : text,
  cn: (...classes: any[]) => classes.filter(Boolean).join(' '),
}))

describe('CourseCard', () => {
  const mockCourse: CourseCardProps['course'] = {
    id: { value: 'course-123' },
    title: 'Introduction to TypeScript',
    description: 'Learn the fundamentals of TypeScript and how to use it effectively in your projects.',
    slug: 'intro-to-typescript',
    price: {
      amount: 49.99,
      currency: 'USD',
      formatted: '$49.99',
    },
    duration: {
      minutes: 180,
      formatted: '3 hours',
    },
    difficulty: 'beginner',
    published: true,
    featured: false,
    learningObjectives: [
      'Understand TypeScript basics',
      'Use TypeScript with React',
      'Configure TypeScript projects',
    ],
    prerequisites: ['Basic JavaScript knowledge'],
    difficultyLevel: 'Beginner',
  }

  describe('Basic Rendering', () => {
    it('renders course title', () => {
      render(<CourseCard course={mockCourse} />)
      expect(screen.getByText('Introduction to TypeScript')).toBeInTheDocument()
    })

    it('renders course description', () => {
      render(<CourseCard course={mockCourse} />)
      expect(screen.getByText(/Learn the fundamentals of TypeScript/)).toBeInTheDocument()
    })

    it('renders difficulty badge', () => {
      render(<CourseCard course={mockCourse} />)
      expect(screen.getByText('Beginner')).toBeInTheDocument()
    })

    it('renders duration', () => {
      render(<CourseCard course={mockCourse} />)
      expect(screen.getByText('3 hours')).toBeInTheDocument()
    })

    it('renders formatted price', () => {
      render(<CourseCard course={mockCourse} />)
      const prices = screen.getAllByText(/\$49\.99/)
      expect(prices.length).toBeGreaterThan(0)
    })
  })

  describe('Featured Badge', () => {
    it('shows featured badge when course is featured', () => {
      const featuredCourse = { ...mockCourse, featured: true }
      render(<CourseCard course={featuredCourse} />)
      expect(screen.getByText('Featured')).toBeInTheDocument()
    })

    it('does not show featured badge when course is not featured', () => {
      render(<CourseCard course={mockCourse} />)
      expect(screen.queryByText('Featured')).not.toBeInTheDocument()
    })
  })

  describe('Difficulty Colors', () => {
    it('applies beginner color', () => {
      const { container } = render(<CourseCard course={mockCourse} />)
      const badge = screen.getByText('Beginner').closest('div')
      expect(badge).toHaveClass('bg-green-100')
      expect(badge).toHaveClass('text-green-800')
    })

    it('applies intermediate color', () => {
      const intermediateCourse = {
        ...mockCourse,
        difficulty: 'intermediate',
        difficultyLevel: 'Intermediate'
      }
      const { container } = render(<CourseCard course={intermediateCourse} />)
      const badge = screen.getByText('Intermediate').closest('div')
      expect(badge).toHaveClass('bg-blue-100')
      expect(badge).toHaveClass('text-blue-800')
    })

    it('applies advanced color', () => {
      const advancedCourse = {
        ...mockCourse,
        difficulty: 'advanced',
        difficultyLevel: 'Advanced'
      }
      render(<CourseCard course={advancedCourse} />)
      const badge = screen.getByText('Advanced').closest('div')
      expect(badge).toHaveClass('bg-orange-100')
      expect(badge).toHaveClass('text-orange-800')
    })

    it('applies expert color', () => {
      const expertCourse = {
        ...mockCourse,
        difficulty: 'expert',
        difficultyLevel: 'Expert'
      }
      render(<CourseCard course={expertCourse} />)
      const badge = screen.getByText('Expert').closest('div')
      expect(badge).toHaveClass('bg-red-100')
      expect(badge).toHaveClass('text-red-800')
    })

    it('applies default color for unknown difficulty', () => {
      const unknownCourse = {
        ...mockCourse,
        difficulty: 'unknown',
        difficultyLevel: 'Unknown'
      }
      render(<CourseCard course={unknownCourse} />)
      const badge = screen.getByText('Unknown').closest('div')
      expect(badge).toHaveClass('bg-gray-100')
      expect(badge).toHaveClass('text-gray-800')
    })
  })

  describe('Price Display', () => {
    it('displays formatted price for paid courses', () => {
      render(<CourseCard course={mockCourse} />)
      const prices = screen.getAllByText(/\$49\.99/)
      expect(prices.length).toBeGreaterThan(0)
    })

    it('displays "Free" for free courses', () => {
      const freeCourse = {
        ...mockCourse,
        price: { amount: 0, currency: 'USD', formatted: '$0.00' },
      }
      render(<CourseCard course={freeCourse} />)
      expect(screen.getByText('Free')).toBeInTheDocument()
    })
  })

  describe('Learning Objectives', () => {
    it('renders learning objectives section', () => {
      render(<CourseCard course={mockCourse} />)
      expect(screen.getByText("What you'll learn:")).toBeInTheDocument()
    })

    it('displays first 3 learning objectives', () => {
      render(<CourseCard course={mockCourse} />)
      expect(screen.getByText('Understand TypeScript basics')).toBeInTheDocument()
      expect(screen.getByText('Use TypeScript with React')).toBeInTheDocument()
      expect(screen.getByText('Configure TypeScript projects')).toBeInTheDocument()
    })

    it('shows count of additional objectives when more than 3', () => {
      const courseWithMany = {
        ...mockCourse,
        learningObjectives: [
          'Objective 1',
          'Objective 2',
          'Objective 3',
          'Objective 4',
          'Objective 5',
        ],
      }
      render(<CourseCard course={courseWithMany} />)
      expect(screen.getByText('+2 more objectives')).toBeInTheDocument()
    })

    it('does not show objectives section when empty', () => {
      const courseWithoutObjectives = {
        ...mockCourse,
        learningObjectives: [],
      }
      render(<CourseCard course={courseWithoutObjectives} />)
      expect(screen.queryByText("What you'll learn:")).not.toBeInTheDocument()
    })
  })

  describe('Enroll Button', () => {
    it('renders enroll button by default for published courses', () => {
      render(<CourseCard course={mockCourse} />)
      expect(screen.getByRole('button', { name: /Enroll for \$49\.99/i })).toBeInTheDocument()
    })

    it('shows "Enroll Free" for free courses', () => {
      const freeCourse = {
        ...mockCourse,
        price: { amount: 0, currency: 'USD', formatted: '$0.00' },
      }
      render(<CourseCard course={freeCourse} />)
      expect(screen.getByRole('button', { name: /Enroll Free/i })).toBeInTheDocument()
    })

    it('does not show enroll button when showEnrollButton is false', () => {
      render(<CourseCard course={mockCourse} showEnrollButton={false} />)
      expect(screen.queryByRole('button', { name: /Enroll/i })).not.toBeInTheDocument()
    })

    it('does not show enroll button for unpublished courses', () => {
      const unpublishedCourse = { ...mockCourse, published: false }
      render(<CourseCard course={unpublishedCourse} />)
      expect(screen.queryByRole('button', { name: /Enroll/i })).not.toBeInTheDocument()
    })

    it('calls onEnroll with course ID when clicked', async () => {
      const handleEnroll = jest.fn()
      const user = userEvent.setup()

      render(<CourseCard course={mockCourse} onEnroll={handleEnroll} />)
      const enrollButton = screen.getByRole('button', { name: /Enroll for/i })

      await user.click(enrollButton)
      expect(handleEnroll).toHaveBeenCalledTimes(1)
      expect(handleEnroll).toHaveBeenCalledWith('course-123')
    })

    it('does not call onEnroll when handler is not provided', async () => {
      const user = userEvent.setup()

      render(<CourseCard course={mockCourse} />)
      const enrollButton = screen.getByRole('button', { name: /Enroll for/i })

      // Should not throw error
      await user.click(enrollButton)
    })
  })

  describe('View Details Button', () => {
    it('always renders view details button', () => {
      render(<CourseCard course={mockCourse} />)
      expect(screen.getByRole('link', { name: /View Details/i })).toBeInTheDocument()
    })

    it('links to correct course page', () => {
      render(<CourseCard course={mockCourse} />)
      const detailsLink = screen.getByRole('link', { name: /View Details/i })
      expect(detailsLink).toHaveAttribute('href', '/courses/intro-to-typescript')
    })
  })

  describe('Links', () => {
    it('title links to course page', () => {
      render(<CourseCard course={mockCourse} />)
      const titleLink = screen.getByRole('link', { name: 'Introduction to TypeScript' })
      expect(titleLink).toHaveAttribute('href', '/courses/intro-to-typescript')
    })
  })

  describe('Custom Styling', () => {
    it('applies custom className', () => {
      const { container } = render(
        <CourseCard course={mockCourse} className="custom-class" />
      )
      const card = container.firstChild
      expect(card).toHaveClass('custom-class')
    })

    it('includes hover shadow effect', () => {
      const { container } = render(<CourseCard course={mockCourse} />)
      const card = container.firstChild
      expect(card).toHaveClass('hover:shadow-lg')
    })
  })

  describe('Edge Cases', () => {
    it('handles very long course title', () => {
      const longTitleCourse = {
        ...mockCourse,
        title: 'This is a very long course title that should be truncated or handled appropriately by the component to maintain proper layout and readability',
      }
      render(<CourseCard course={longTitleCourse} />)
      expect(screen.getByText(/This is a very long course title/)).toBeInTheDocument()
    })

    it('handles very long description', () => {
      const longDescCourse = {
        ...mockCourse,
        description: 'A'.repeat(200),
      }
      render(<CourseCard course={longDescCourse} />)
      // Should truncate to 150 chars plus "..."
      expect(screen.getByText(/A+\.\.\./)).toBeInTheDocument()
    })

    it('handles empty prerequisites array', () => {
      const courseWithoutPrereqs = {
        ...mockCourse,
        prerequisites: [],
      }
      render(<CourseCard course={courseWithoutPrereqs} />)
      expect(screen.getByText('Introduction to TypeScript')).toBeInTheDocument()
    })
  })
})

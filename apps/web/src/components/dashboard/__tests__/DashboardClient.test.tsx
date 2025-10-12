/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { DashboardClient } from '../DashboardClient'
import type { LocalizedContent, PageContent } from '@/types/content'

// Mock fetch globally
global.fetch = jest.fn()

// Mock child components
jest.mock('../DashboardLayout', () => ({
  DashboardLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dashboard-layout">{children}</div>
  ),
}))

jest.mock('../StatsCard', () => ({
  StatsCard: ({ label, value, icon, color }: any) => (
    <div data-testid="stats-card" data-label={label} data-value={value} data-icon={icon} data-color={color}>
      {label}: {value}
    </div>
  ),
}))

jest.mock('../CoursesEnrolled', () => ({
  CoursesEnrolled: ({ courses, emptyMessage, ctaText, ctaHref }: any) => (
    <div data-testid="courses-enrolled">
      {courses.length === 0 ? (
        <div>{emptyMessage}</div>
      ) : (
        <div>{courses.length} courses</div>
      )}
    </div>
  ),
}))

jest.mock('../RecentActivity', () => ({
  RecentActivity: ({ activities, emptyMessage }: any) => (
    <div data-testid="recent-activity">
      {activities.length === 0 ? (
        <div>{emptyMessage}</div>
      ) : (
        <div>{activities.length} activities</div>
      )}
    </div>
  ),
}))

// Mock hooks
jest.mock('@/hooks/use-localized-content', () => ({
  useLocalizedContent: (content: any) => content,
}))

const mockUser = {
  id: 'user-123',
  name: 'John Doe',
  email: 'john@example.com',
}

jest.mock('@/contexts/security', () => ({
  useSecurityContext: () => ({ user: mockUser }),
}))

describe('DashboardClient', () => {
  const mockLocalizedContent: LocalizedContent<PageContent> = {
    hero: {
      greeting: 'Welcome back',
      subtitle: 'Continue your learning journey',
    },
    overview: {
      stats: [
        { label: 'Courses Enrolled' },
        { label: 'Hours Learned' },
        { label: 'Achievements' },
        { label: 'Current Streak' },
      ],
    },
    courses: {
      title: 'My Courses',
      empty: {
        message: 'No courses enrolled yet',
        cta: {
          text: 'Browse Courses',
          href: '/courses',
        },
      },
      continue_learning: 'Continue Learning',
      progress_label: 'Progress',
    },
    recent_activity: {
      title: 'Recent Activity',
      empty: 'No recent activity',
    },
  } as any

  const mockDashboardData = {
    stats: {
      coursesEnrolled: 5,
      hoursLearned: 42,
      achievements: 12,
      currentStreak: 7,
    },
    enrolledCourses: [
      {
        id: 'course-1',
        title: 'TypeScript Fundamentals',
        progress: 65,
      },
      {
        id: 'course-2',
        title: 'React Advanced Patterns',
        progress: 30,
      },
    ],
    recentActivity: [
      {
        id: 'activity-1',
        type: 'course_completed',
        title: 'Completed lesson',
        timestamp: '2025-10-10T10:00:00Z',
      },
    ],
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockDashboardData,
    })
  })

  describe('Loading State', () => {
    it('shows loading spinner initially', async () => {
      render(<DashboardClient localizedContent={mockLocalizedContent} />)
      expect(screen.getByText('Loading dashboard...')).toBeInTheDocument()

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByText('Loading dashboard...')).not.toBeInTheDocument()
      })
    })

    it('shows loading spinner with animation', async () => {
      const { container } = render(<DashboardClient localizedContent={mockLocalizedContent} />)
      const spinner = container.querySelector('.animate-spin')
      expect(spinner).toBeInTheDocument()

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByText('Loading dashboard...')).not.toBeInTheDocument()
      })
    })

    it('renders within DashboardLayout during loading', async () => {
      render(<DashboardClient localizedContent={mockLocalizedContent} />)
      expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument()

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByText('Loading dashboard...')).not.toBeInTheDocument()
      })
    })
  })

  describe('Data Fetching', () => {
    it('fetches dashboard data from API', async () => {
      render(<DashboardClient localizedContent={mockLocalizedContent} />)

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/user/dashboard')
      })
    })

    it('renders dashboard data after loading', async () => {
      render(<DashboardClient localizedContent={mockLocalizedContent} />)

      await waitFor(() => {
        expect(screen.queryByText('Loading dashboard...')).not.toBeInTheDocument()
      })

      expect(screen.getByText(/Courses Enrolled: 5/)).toBeInTheDocument()
      expect(screen.getByText(/Hours Learned: 42/)).toBeInTheDocument()
      expect(screen.getByText(/Achievements: 12/)).toBeInTheDocument()
    })
  })

  describe('Stats Cards', () => {
    it('renders all four stats cards', async () => {
      render(<DashboardClient localizedContent={mockLocalizedContent} />)

      await waitFor(() => {
        const statsCards = screen.getAllByTestId('stats-card')
        expect(statsCards).toHaveLength(4)
      })
    })

    it('renders courses enrolled stat', async () => {
      render(<DashboardClient localizedContent={mockLocalizedContent} />)

      await waitFor(() => {
        const card = screen.getByText(/Courses Enrolled: 5/)
        expect(card).toBeInTheDocument()
      })
    })

    it('renders hours learned stat', async () => {
      render(<DashboardClient localizedContent={mockLocalizedContent} />)

      await waitFor(() => {
        const card = screen.getByText(/Hours Learned: 42/)
        expect(card).toBeInTheDocument()
      })
    })

    it('renders achievements stat', async () => {
      render(<DashboardClient localizedContent={mockLocalizedContent} />)

      await waitFor(() => {
        const card = screen.getByText(/Achievements: 12/)
        expect(card).toBeInTheDocument()
      })
    })

    it('renders current streak with days suffix', async () => {
      render(<DashboardClient localizedContent={mockLocalizedContent} />)

      await waitFor(() => {
        const card = screen.getByText(/Current Streak: 7 days/)
        expect(card).toBeInTheDocument()
      })
    })

    it('assigns correct icons to stats cards', async () => {
      render(<DashboardClient localizedContent={mockLocalizedContent} />)

      await waitFor(() => {
        const cards = screen.getAllByTestId('stats-card')
        expect(cards[0]).toHaveAttribute('data-icon', 'BookOpen')
        expect(cards[1]).toHaveAttribute('data-icon', 'Clock')
        expect(cards[2]).toHaveAttribute('data-icon', 'Award')
        expect(cards[3]).toHaveAttribute('data-icon', 'Flame')
      })
    })

    it('assigns correct colors to stats cards', async () => {
      render(<DashboardClient localizedContent={mockLocalizedContent} />)

      await waitFor(() => {
        const cards = screen.getAllByTestId('stats-card')
        expect(cards[0]).toHaveAttribute('data-color', 'blue')
        expect(cards[1]).toHaveAttribute('data-color', 'green')
        expect(cards[2]).toHaveAttribute('data-color', 'purple')
        expect(cards[3]).toHaveAttribute('data-color', 'orange')
      })
    })
  })

  describe('User Greeting', () => {
    it('displays personalized greeting with user first name', async () => {
      render(<DashboardClient localizedContent={mockLocalizedContent} />)

      await waitFor(() => {
        expect(screen.getByText(/Welcome back, John!/)).toBeInTheDocument()
      })
    })

    it('displays subtitle from localized content', async () => {
      render(<DashboardClient localizedContent={mockLocalizedContent} />)

      await waitFor(() => {
        expect(screen.getByText('Continue your learning journey')).toBeInTheDocument()
      })
    })

    it('handles user with name and displays first name', async () => {
      // Test with actual user having a name
      render(<DashboardClient localizedContent={mockLocalizedContent} />)

      await waitFor(() => {
        // User's first name (John from "John Doe") should be displayed
        expect(screen.getByText(/John/)).toBeInTheDocument()
      })
    })
  })

  describe('Enrolled Courses Section', () => {
    it('renders courses section with title', async () => {
      render(<DashboardClient localizedContent={mockLocalizedContent} />)

      await waitFor(() => {
        expect(screen.getByText('My Courses')).toBeInTheDocument()
      })
    })

    it('passes enrolled courses to CoursesEnrolled component', async () => {
      render(<DashboardClient localizedContent={mockLocalizedContent} />)

      await waitFor(() => {
        expect(screen.getByText('2 courses')).toBeInTheDocument()
      })
    })

    it('shows empty state when no courses', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          ...mockDashboardData,
          enrolledCourses: [],
        }),
      })

      render(<DashboardClient localizedContent={mockLocalizedContent} />)

      await waitFor(() => {
        expect(screen.getByText('No courses enrolled yet')).toBeInTheDocument()
      })
    })
  })

  describe('Recent Activity Section', () => {
    it('renders recent activity section with title', async () => {
      render(<DashboardClient localizedContent={mockLocalizedContent} />)

      await waitFor(() => {
        expect(screen.getByText('Recent Activity')).toBeInTheDocument()
      })
    })

    it('passes activities to RecentActivity component', async () => {
      render(<DashboardClient localizedContent={mockLocalizedContent} />)

      await waitFor(() => {
        expect(screen.getByText('1 activities')).toBeInTheDocument()
      })
    })

    it('shows empty state when no activities', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          ...mockDashboardData,
          recentActivity: [],
        }),
      })

      render(<DashboardClient localizedContent={mockLocalizedContent} />)

      await waitFor(() => {
        expect(screen.getByText('No recent activity')).toBeInTheDocument()
      })
    })
  })

  describe('Error Handling', () => {
    it('handles fetch errors gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      ;(global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'))

      render(<DashboardClient localizedContent={mockLocalizedContent} />)

      await waitFor(() => {
        expect(screen.queryByText('Loading dashboard...')).not.toBeInTheDocument()
      })

      expect(consoleSpy).toHaveBeenCalledWith('Failed to load dashboard:', expect.any(Error))
      consoleSpy.mockRestore()
    })

    it('renders with default stats when API fails', async () => {
      ;(global.fetch as jest.Mock).mockRejectedValue(new Error('API error'))

      render(<DashboardClient localizedContent={mockLocalizedContent} />)

      await waitFor(() => {
        expect(screen.getByText(/Courses Enrolled: 0/)).toBeInTheDocument()
        expect(screen.getByText(/Hours Learned: 0/)).toBeInTheDocument()
      })
    })

    it('continues rendering after error', async () => {
      ;(global.fetch as jest.Mock).mockRejectedValue(new Error('API error'))

      render(<DashboardClient localizedContent={mockLocalizedContent} />)

      await waitFor(() => {
        expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument()
        expect(screen.getByText('My Courses')).toBeInTheDocument()
      })
    })
  })

  describe('Localized Content Fallbacks', () => {
    it('uses fallback labels when content is missing', async () => {
      const minimalContent = {
        hero: {},
        overview: {},
        courses: {},
        recent_activity: {},
      } as any

      render(<DashboardClient localizedContent={minimalContent} />)

      await waitFor(() => {
        expect(screen.getByText('My Courses')).toBeInTheDocument()
        expect(screen.getByText('Recent Activity')).toBeInTheDocument()
      })
    })
  })

  describe('Layout and Responsiveness', () => {
    it('uses responsive grid for stats cards', async () => {
      const { container } = render(<DashboardClient localizedContent={mockLocalizedContent} />)

      await waitFor(() => {
        const grid = container.querySelector('.grid.gap-6.md\\:grid-cols-2.lg\\:grid-cols-4')
        expect(grid).toBeInTheDocument()
      })
    })

    it('uses responsive grid for courses and activity sections', async () => {
      const { container } = render(<DashboardClient localizedContent={mockLocalizedContent} />)

      await waitFor(() => {
        const grid = container.querySelector('.grid.gap-8.lg\\:grid-cols-3')
        expect(grid).toBeInTheDocument()
      })
    })

    it('renders within max-width container', async () => {
      const { container } = render(<DashboardClient localizedContent={mockLocalizedContent} />)

      await waitFor(() => {
        const maxWidthContainer = container.querySelector('.max-w-7xl')
        expect(maxWidthContainer).toBeInTheDocument()
      })
    })
  })
})

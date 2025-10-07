// Dashboard Overview API
// Returns user stats, recent activity, and quick summary

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // TODO: Fetch real data from database
    // For now, returning mock data for UI development
    const dashboardData = {
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      },
      stats: {
        coursesEnrolled: 0,
        hoursLearned: 0,
        achievements: 0,
        currentStreak: 0,
      },
      recentActivity: [],
      enrolledCourses: [],
      upcomingLessons: [],
    }

    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error('[Dashboard API] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

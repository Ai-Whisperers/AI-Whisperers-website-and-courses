/**
 * User Progress API
 * Returns learning progress, completion stats, and streaks
 *
 * PHASE 0.6C: Migrated to NextAuth v5
 * - Replaced getServerSession(authOptions) with auth()
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth/auth.config'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // TODO: Calculate real progress from database
    const progress = {
      totalLessonsCompleted: 0,
      totalQuizzesPassed: 0,
      totalHoursLearned: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: null,
      weeklyProgress: [],
    }

    return NextResponse.json(progress)
  } catch (error) {
    console.error('[Progress API] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

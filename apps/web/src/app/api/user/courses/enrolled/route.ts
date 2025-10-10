/**
 * Enrolled Courses API
 * Returns list of courses the user is enrolled in with progress
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

    // TODO: Fetch real enrolled courses from database
    const enrolledCourses = []

    return NextResponse.json({
      courses: enrolledCourses,
      total: enrolledCourses.length,
    })
  } catch (error) {
    console.error('[Enrolled Courses API] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

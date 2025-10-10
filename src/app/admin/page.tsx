/**
 * Admin Dashboard Page
 * Protected route - requires admin role
 *
 * PHASE 0.6C: Migrated to NextAuth v5
 * - Replaced getServerSession(authOptions) with auth()
 */

import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth/auth.config'
import { getLocalizedPageContent } from '@/lib/content/server-compiled'
import { AdminClient } from '@/components/admin/AdminClient'

export const metadata = {
  title: 'Admin Panel | AI Whisperers',
  description: 'Platform administration dashboard',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function AdminPage() {
  const session = await auth()

  // Redirect to signin if not authenticated
  if (!session) {
    redirect('/auth/signin?callbackUrl=/admin')
  }

  // Check if user has admin role (CRITICAL SECURITY CHECK)
  const userRole = (session.user as any)?.role
  if (!userRole || (userRole !== 'admin' && userRole !== 'instructor')) {
    // Redirect unauthorized users to dashboard with error message
    redirect('/dashboard?error=unauthorized&message=Admin access required')
  }

  const localizedContent = await getLocalizedPageContent('admin')

  return <AdminClient localizedContent={localizedContent} />
}

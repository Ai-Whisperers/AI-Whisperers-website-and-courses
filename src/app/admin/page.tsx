// Admin Dashboard Page
// Protected route - requires admin role

import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
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
  const session = await getServerSession(authOptions)

  // Redirect to signin if not authenticated
  if (!session) {
    redirect('/auth/signin?callbackUrl=/admin')
  }

  // TODO: Check if user has admin role
  // if (session.user.role !== 'ADMIN') {
  //   redirect('/dashboard')
  // }

  const localizedContent = await getLocalizedPageContent('admin')

  return <AdminClient localizedContent={localizedContent} />
}

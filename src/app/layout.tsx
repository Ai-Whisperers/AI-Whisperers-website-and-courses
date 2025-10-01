// Root Layout
// Global layout with providers and navigation

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/providers/auth-provider'
import { LanguageProvider } from '@/lib/i18n/context'
import { ThemeProvider } from '@/lib/themes/themeContext'
import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/layout/footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Whisperers - Master AI with World-Class Education',
  description: 'Comprehensive AI courses from beginner to expert. Learn artificial intelligence through hands-on projects, real-world applications, and expert instruction.',
  keywords: ['AI courses', 'artificial intelligence', 'machine learning', 'AI education', 'programming', 'technology'],
  authors: [{ name: 'AI Whisperers' }],
  openGraph: {
    title: 'AI Whisperers - Master AI with World-Class Education',
    description: 'Comprehensive AI courses from beginner to expert',
    url: 'https://aiwhisperers.com',
    siteName: 'AI Whisperers',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Whisperers - Master AI with World-Class Education',
    description: 'Comprehensive AI courses from beginner to expert',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <div className="flex flex-col min-h-screen">
                <Navigation />
                <main className="flex-1">
                  {children}
                </main>
                <Footer />
              </div>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Home Management App - Vishwa & Shruthi',
  description: 'A comprehensive home management application for couples to organize tasks, meals, shopping, finances, and travel together.',
  keywords: ['home management', 'couples app', 'task management', 'meal planning', 'budget tracking'],
  authors: [{ name: 'Vishwa & Shruthi' }],
  viewport: 'width=device-width, initial-scale=1',
}

/**
 * Root Layout Component
 * 
 * Provides the base HTML structure for the entire application.
 * Includes global CSS and metadata configuration.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className="min-h-screen bg-white antialiased">
        <main role="main" className="relative">
          {children}
        </main>
      </body>
    </html>
  )
}

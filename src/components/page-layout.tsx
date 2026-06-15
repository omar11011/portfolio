'use client'

import { Navbar } from '@/components/navbar'

interface PageLayoutProps {
  children: React.ReactNode
  profileName?: string
}

export function PageLayout({ children, profileName }: PageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar profileName={profileName} />
      <main className="flex-1 pt-20">
        {children}
      </main>
    </div>
  )
}

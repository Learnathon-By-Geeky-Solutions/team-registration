'use client'

import { AdminNav } from '@/components/admin-nav'
import { Session } from 'next-auth'
import SessionProvider from '../SessionProvider'

interface ClientAdminLayoutProps {
  children: React.ReactNode
  session: Session | null
}

export default function ClientAdminLayout({ children, session }: ClientAdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <SessionProvider session={session}>{children}</SessionProvider>
      </main>
    </div>
  )
}
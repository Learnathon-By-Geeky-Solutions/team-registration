'use client'

import { useEffect, useState } from 'react'
import { getConfig } from '@/lib/actions/config'
import { ConfigForm } from '@/components/config-form'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Settings } from 'lucide-react'

export default function SettingsPage() {
  const [config, setConfig] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setIsLoading(true)
        const data = await getConfig()
        setConfig(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load config')
      } finally {
        setIsLoading(false)
      }
    }

    fetchConfig()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading settings...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Platform Settings</h1>
        <Link href="/admin/settings/tech-stacks">
          <Button variant="outline" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Manage Tech Stacks
          </Button>
        </Link>
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        
       { 
       //@ts-ignore
       <ConfigForm initialData={config} />}
      </div>
    </div>
  )
}
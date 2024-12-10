'use client'

import { useEffect, useState } from 'react'
import { AssignmentDashboard } from '@/components/assignment-dashboard'
import { fetchAssignmentStatus } from './actions/assignments'

export default function AssignmentsClient() {
  const [status, setStatus] = useState<any|null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any | null>(null)

  useEffect(() => {
    async function loadAssignments() {
      try {
        const result = await fetchAssignmentStatus()
        if (result.success) {
          setStatus(result.data)
        } else {
          setError(result.error)
        }
      } catch (err) {
        setError('Failed to load assignments')
      } finally {
        setLoading(false)
      }
    }

    loadAssignments()
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center py-8">Loading assignments...</div>
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="text-sm text-red-700">{error}</div>
      </div>
    )
  }

  return <AssignmentDashboard initialStatus={status} />
}
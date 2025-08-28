'use client'
import { useState, useEffect } from 'react'
import { DATABASE_TABLES } from '@/constants'
import Button from '@/app/components/base/button'

interface DatabaseData {
  table: string
  count: number
  limit: number
  data: any[]
}

export default function AdminPage() {
  const [data, setData] = useState<DatabaseData | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedTable, setSelectedTable] = useState('ConversationMemory')
  const [status, setStatus] = useState<any>(null)

  const tables = DATABASE_TABLES

  const fetchData = async (table: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/database?table=${table}&limit=20`)
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    }
    setLoading(false)
  }

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/admin/database', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'status' })
      })
      const result = await response.json()
      setStatus(result.tables)
    } catch (error) {
      console.error('Failed to fetch status:', error)
    }
  }

  useEffect(() => {
    fetchData(selectedTable)
    fetchStatus()
  }, [selectedTable])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Database Admin</h1>
        
        {/* Status Overview */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Database Status</h2>
          {status ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(status).map(([table, count]) => (
                <div key={table} className="bg-blue-50 p-3 rounded">
                  <div className="text-sm text-gray-600">{table}</div>
                  <div className="text-2xl font-bold text-blue-600">{count as number}</div>
                </div>
              ))}
            </div>
          ) : (
            <p>Loading status...</p>
          )}
        </div>

        {/* Table Selector */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Browse Tables</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {tables.map(table => (
              <Button
                key={table}
                size='sm'
                variant={selectedTable === table ? 'primary' : 'secondary'}
                onClick={() => setSelectedTable(table)}
              >
                {table}
              </Button>
            ))}
          </div>
        </div>

        {/* Data Display */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{selectedTable}</h2>
            <Button
              variant='primary'
              onClick={() => fetchData(selectedTable)}
              disabled={loading}
              loading={loading}
            >
              Refresh
            </Button>
          </div>
          
          {data ? (
            <div>
              <p className="text-sm text-gray-600 mb-4">
                Showing {data.data.length} of {data.count} records
              </p>
              <div className="overflow-x-auto">
                <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-96">
                  {JSON.stringify(data.data, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <p>Loading data...</p>
          )}
        </div>
      </div>
    </div>
  )
}

'use client'
import React, { useMemo, useState } from 'react'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(r => r.json())

type TabKey = 'messages' | 'workflows' | 'nodes' | 'memory'

const ManualSync: React.FC<{ memoryUserId: string }> = ({ memoryUserId }) => {
  const [convId, setConvId] = useState('')
  const onSync = async () => {
    const p = new URLSearchParams()
    if (convId) p.set('conversation_id', convId)
    if (memoryUserId) p.set('user', memoryUserId)
    const res = await fetch(`/api/memory/sync?${p.toString()}`)
    // no toast here to keep simple
    console.log('sync result', await res.json())
  }
  return (
    <div className='flex items-end gap-2'>
      <div className='grow'>
        <label className='block text-xs text-gray-600'>Conversation ID</label>
        <input className='w-full border rounded px-2 py-1' value={convId} onChange={e => setConvId(e.target.value)} placeholder='conversation_id' />
      </div>
      <div>
        <label className='block text-xs text-gray-600 invisible'>.</label>
        <button className='px-3 py-1 rounded bg-primary-600 text-white' onClick={onSync}>Sync</button>
      </div>
    </div>
  )
}

const LogsPage: React.FC = () => {
  const [active, setActive] = useState<TabKey>('messages')
  const [limit, setLimit] = useState(50)
  const [conversationId, setConversationId] = useState('')
  const [userId, setUserId] = useState('')
  const [messageId, setMessageId] = useState('')
  const [runId, setRunId] = useState('')

  const messageUrl = useMemo(() => {
    const p = new URLSearchParams()
    p.set('limit', String(limit))
    if (conversationId) p.set('conversation_id', conversationId)
    if (userId) p.set('user_id', userId)
    return `/api/logs/message?${p.toString()}`
  }, [limit, conversationId, userId])

  const workflowUrl = useMemo(() => {
    const p = new URLSearchParams()
    p.set('limit', String(limit))
    if (conversationId) p.set('conversation_id', conversationId)
    if (messageId) p.set('message_id', messageId)
    return `/api/logs/workflow?${p.toString()}`
  }, [limit, conversationId, messageId])

  const nodeUrl = useMemo(() => {
    const p = new URLSearchParams()
    p.set('limit', String(Math.max(limit, 100)))
    if (runId) p.set('run_id', runId)
    return `/api/logs/node?${p.toString()}`
  }, [limit, runId])

  const { data: messageData, isLoading: loadingMessages, mutate: reloadMessages } = useSWR(active === 'messages' ? messageUrl : null, fetcher)
  const { data: workflowData, isLoading: loadingWorkflows, mutate: reloadWorkflows } = useSWR(active === 'workflows' ? workflowUrl : null, fetcher)
  const { data: nodeData, isLoading: loadingNodes, mutate: reloadNodes } = useSWR(active === 'nodes' ? nodeUrl : null, fetcher)
  const [memoryUserId, setMemoryUserId] = useState('')
  const memoryUrl = useMemo(() => {
    const p = new URLSearchParams()
    if (memoryUserId) p.set('user', memoryUserId)
    return `/api/user-memory${p.toString() ? `?${p.toString()}` : ''}`
  }, [memoryUserId])
  const memoryHistUrl = useMemo(() => {
    const p = new URLSearchParams()
    p.set('limit', '50')
    if (memoryUserId) p.set('user', memoryUserId)
    return `/api/user-memory/history?${p.toString()}`
  }, [memoryUserId])
  const { data: memoryData, isLoading: loadingMemory, mutate: reloadMemory } = useSWR(active === 'memory' ? memoryUrl : null, fetcher)
  const { data: memoryHistData, isLoading: loadingMemoryHist, mutate: reloadMemoryHist } = useSWR(active === 'memory' ? memoryHistUrl : null, fetcher)

  const onRefresh = () => {
    if (active === 'messages') reloadMessages()
    if (active === 'workflows') reloadWorkflows()
    if (active === 'nodes') reloadNodes()
    if (active === 'memory') { reloadMemory(); reloadMemoryHist() }
  }

  return (
    <div className='p-6 max-w-6xl mx-auto'>
      <h1 className='text-xl font-semibold mb-4'>Logs</h1>

      <div className='flex items-center gap-2 mb-4'>
        <button className={`px-3 py-1 rounded ${active === 'messages' ? 'bg-gray-900 text-white' : 'bg-gray-100'}`} onClick={() => setActive('messages')}>Messages</button>
        <button className={`px-3 py-1 rounded ${active === 'workflows' ? 'bg-gray-900 text-white' : 'bg-gray-100'}`} onClick={() => setActive('workflows')}>Workflows</button>
        <button className={`px-3 py-1 rounded ${active === 'nodes' ? 'bg-gray-900 text-white' : 'bg-gray-100'}`} onClick={() => setActive('nodes')}>Nodes</button>
        <button className={`px-3 py-1 rounded ${active === 'memory' ? 'bg-gray-900 text-white' : 'bg-gray-100'}`} onClick={() => setActive('memory')}>Memory</button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4'>
        <div>
          <label className='block text-xs text-gray-600'>Limit</label>
          <input className='w-full border rounded px-2 py-1' type='number' value={limit} onChange={e => setLimit(Number(e.target.value || 0))} />
        </div>
        {(active === 'messages' || active === 'workflows') && (
          <div>
            <label className='block text-xs text-gray-600'>Conversation ID</label>
            <input className='w-full border rounded px-2 py-1' value={conversationId} onChange={e => setConversationId(e.target.value)} placeholder='optional' />
          </div>
        )}
        {active === 'messages' && (
          <div>
            <label className='block text-xs text-gray-600'>User ID</label>
            <input className='w-full border rounded px-2 py-1' value={userId} onChange={e => setUserId(e.target.value)} placeholder='optional' />
          </div>
        )}
        {active === 'workflows' && (
          <div>
            <label className='block text-xs text-gray-600'>Message ID</label>
            <input className='w-full border rounded px-2 py-1' value={messageId} onChange={e => setMessageId(e.target.value)} placeholder='optional' />
          </div>
        )}
        {active === 'nodes' && (
          <div>
            <label className='block text-xs text-gray-600'>Run ID</label>
            <input className='w-full border rounded px-2 py-1' value={runId} onChange={e => setRunId(e.target.value)} placeholder='workflow_run_id' />
          </div>
        )}
        <div className='self-end'>
          <button className='px-3 py-1 rounded bg-primary-600 text-white' onClick={onRefresh}>Refresh</button>
        </div>
      </div>

      {active === 'messages' && (
        <div className='overflow-x-auto border rounded'>
          <table className='min-w-full text-sm'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='text-left px-3 py-2'>Created</th>
                <th className='text-left px-3 py-2'>Message ID</th>
                <th className='text-left px-3 py-2'>Conversation</th>
                <th className='text-left px-3 py-2'>User</th>
                <th className='text-left px-3 py-2'>Query</th>
                <th className='text-left px-3 py-2'>Answer</th>
              </tr>
            </thead>
            <tbody>
              {loadingMessages && (
                <tr><td className='px-3 py-2' colSpan={6}>Loading...</td></tr>
              )}
              {messageData?.data?.map((row: any) => (
                <tr key={row.id} className='border-t'>
                  <td className='px-3 py-2 whitespace-nowrap'>{new Date(row.createdAt).toLocaleString()}</td>
                  <td className='px-3 py-2'>{row.id}</td>
                  <td className='px-3 py-2'>{row.conversationId}</td>
                  <td className='px-3 py-2'>{row.userId}</td>
                  <td className='px-3 py-2 max-w-[320px] truncate' title={row.query || ''}>{row.query}</td>
                  <td className='px-3 py-2 max-w-[320px] truncate' title={row.answer || ''}>{row.answer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {active === 'workflows' && (
        <div className='overflow-x-auto border rounded'>
          <table className='min-w-full text-sm'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='text-left px-3 py-2'>Created</th>
                <th className='text-left px-3 py-2'>Run ID</th>
                <th className='text-left px-3 py-2'>Message ID</th>
                <th className='text-left px-3 py-2'>Conversation</th>
                <th className='text-left px-3 py-2'>Status</th>
                <th className='text-left px-3 py-2'>Error</th>
              </tr>
            </thead>
            <tbody>
              {loadingWorkflows && (
                <tr><td className='px-3 py-2' colSpan={6}>Loading...</td></tr>
              )}
              {workflowData?.data?.map((row: any) => (
                <tr key={row.id} className='border-t'>
                  <td className='px-3 py-2 whitespace-nowrap'>{new Date(row.createdAt).toLocaleString()}</td>
                  <td className='px-3 py-2'>{row.id}</td>
                  <td className='px-3 py-2'>{row.messageId}</td>
                  <td className='px-3 py-2'>{row.conversationId}</td>
                  <td className='px-3 py-2'>{row.status}</td>
                  <td className='px-3 py-2 max-w-[320px] truncate' title={row.error || ''}>{row.error}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {active === 'nodes' && (
        <div className='overflow-x-auto border rounded'>
          <table className='min-w-full text-sm'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='text-left px-3 py-2'>Created</th>
                <th className='text-left px-3 py-2'>Run ID</th>
                <th className='text-left px-3 py-2'>Node ID</th>
                <th className='text-left px-3 py-2'>Title</th>
                <th className='text-left px-3 py-2'>Status</th>
                <th className='text-left px-3 py-2'>Error</th>
              </tr>
            </thead>
            <tbody>
              {loadingNodes && (
                <tr><td className='px-3 py-2' colSpan={6}>Loading...</td></tr>
              )}
              {nodeData?.data?.map((row: any) => (
                <tr key={row.id} className='border-t'>
                  <td className='px-3 py-2 whitespace-nowrap'>{new Date(row.createdAt).toLocaleString()}</td>
                  <td className='px-3 py-2'>{row.runId}</td>
                  <td className='px-3 py-2'>{row.nodeId}</td>
                  <td className='px-3 py-2 max-w-[280px] truncate' title={row.title || ''}>{row.title}</td>
                  <td className='px-3 py-2'>{row.status}</td>
                  <td className='px-3 py-2 max-w-[320px] truncate' title={row.error || ''}>{row.error}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {active === 'memory' && (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
          <div className='border rounded p-3'>
            <div className='font-medium mb-2'>Current Memory</div>
            <div className='flex items-end gap-2 mb-3'>
              <div className='flex-1'>
                <label className='block text-xs text-gray-600'>User ID (override)</label>
                <input className='w-full border rounded px-2 py-1' value={memoryUserId} onChange={e => setMemoryUserId(e.target.value)} placeholder='optional: user_*' />
              </div>
              <div>
                <label className='block text-xs text-gray-600 invisible'>.</label>
                <button className='px-3 py-1 rounded bg-gray-900 text-white' onClick={() => { reloadMemory(); reloadMemoryHist() }}>Load</button>
              </div>
            </div>
            {loadingMemory ? (
              <div>Loading...</div>
            ) : (
              <pre className='text-xs whitespace-pre-wrap break-all bg-gray-50 p-2 rounded'>{JSON.stringify(memoryData, null, 2)}</pre>
            )}
          </div>
          <div className='border rounded p-3'>
            <div className='font-medium mb-2'>History (latest 50)</div>
            {loadingMemoryHist ? (
              <div>Loading...</div>
            ) : (
              <div className='max-h-[480px] overflow-auto'>
                {memoryHistData?.data?.map((h: any) => (
                  <div key={h.id} className='border-b pb-2 mb-2'>
                    <div className='text-xs text-gray-600'>v{h.version} · {new Date(h.createdAt).toLocaleString()} · source: {h.source || '-'}</div>
                    <pre className='text-xs whitespace-pre-wrap break-all bg-gray-50 p-2 rounded mt-1'>{JSON.stringify(h.snapshot, null, 2)}</pre>
                  </div>
                ))}
              </div>
            )}
            <div className='mt-3 p-2 bg-gray-50 rounded'>
              <div className='text-xs font-medium mb-1'>Manual sync from Dify variables</div>
              <ManualSync memoryUserId={memoryUserId} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LogsPage

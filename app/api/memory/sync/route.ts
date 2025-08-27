import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import axios from 'axios'
import { getInfo } from '@/app/api/utils/common'
import { API_KEY, API_URL } from '@/config'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const deepMerge = (target: any, source: any) => {
  if (typeof target !== 'object' || target === null) return source
  if (typeof source !== 'object' || source === null) return source
  const out: any = Array.isArray(target) ? [...target] : { ...target }
  Object.keys(source).forEach((key) => {
    const sv = (source as any)[key]
    const tv = (out as any)[key]
    if (sv && typeof sv === 'object' && !Array.isArray(sv))
      (out as any)[key] = deepMerge(tv ?? {}, sv)
    else
      (out as any)[key] = sv
  })
  return out
}

// GET /api/memory/sync?conversation_id=...
// Fetch Dify conversation variables(memory) and upsert to local UserMemory
export async function GET(req: NextRequest) {
  try {
    const { user } = getInfo(req)
    const { searchParams } = new URL(req.url)
    const conversationId = searchParams.get('conversation_id')
    const replace = searchParams.get('replace') === '1'
    
    console.log('[Memory Sync] Starting sync for user:', user, 'conversation:', conversationId)
    
    if (!conversationId)
      return NextResponse.json({ error: 'conversation_id is required' }, { status: 400 })

    const url = `${API_URL || 'https://api.dify.ai/v1'}/conversations/${conversationId}/variables`
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
      params: { user },
    })
    
    const list: Array<{ name: string; value: any }> = res.data?.data || []
    const memoryItem = list.find(x => x.name === 'memory')
    
    if (!memoryItem) {
      console.log('[Memory Sync] No memory variable found')
      return NextResponse.json({ ok: true, note: 'no memory variable found' })
    }
    
    let incoming: any = memoryItem.value
    
    if (typeof incoming === 'string') {
      // try parse JSON; if value is single-quoted pseudo-JSON, normalize
      try {
        incoming = JSON.parse(incoming)
      } catch {
        try {
          const normalized = incoming.replace(/'/g, '"').replace(/None/g, 'null')
          incoming = JSON.parse(normalized)
        } catch {
          console.log('[Memory Sync] Failed to parse memory value, using empty object')
          incoming = {}
        }
      }
    }
    
    // If memory is an array, take the first element
    if (Array.isArray(incoming) && incoming.length > 0) {
      incoming = incoming[0]
    }
    
    console.log('[Memory Sync] Successfully parsed memory for user:', user, 'version will be:', (await prisma.userMemory.findUnique({ where: { userId: user } }))?.version ? (await prisma.userMemory.findUnique({ where: { userId: user } }))!.version + 1 : 1)
    const existing = await prisma.userMemory.findUnique({ where: { userId: user } })
    const current = existing ? JSON.parse(existing.memory) : {}
    const merged = replace ? incoming : deepMerge(current, incoming)
    const nextVersion = (existing?.version ?? 0) + 1

    const upserted = await prisma.userMemory.upsert({
      where: { userId: user },
      update: { memory: JSON.stringify(merged), version: nextVersion },
      create: { userId: user, memory: JSON.stringify(merged), version: nextVersion },
    })
    await prisma.userMemoryHistory.create({
      data: {
        userId: user,
        version: nextVersion,
        snapshot: JSON.stringify(merged),
        source: 'dify_pull',
        conversationId,
      },
    })

    return NextResponse.json({ ok: true, userId: upserted.userId, version: upserted.version })
  }
  catch (e: any) {
    console.error('[Memory Sync] Error:', e?.message || e)
    console.error('[Memory Sync] Stack:', e?.stack)
    return NextResponse.json({ error: e?.message || 'server error' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import axios from 'axios'
import { getInfo } from '@/app/api/utils/common'
import { API_KEY, API_URL } from '@/config'
import { prisma } from '@/lib/prisma'

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

// GET /api/conversation-memory/sync?conversation_id=...
// Fetch Dify conversation variables(memory) and upsert to local ConversationMemory
export async function GET(req: NextRequest) {
  try {
    const { user } = getInfo(req)
    const { searchParams } = new URL(req.url)
    const conversationId = searchParams.get('conversation_id')
    const replace = searchParams.get('replace') === '1'
    
    console.log('[Conversation Memory Sync] Starting sync for conversation:', conversationId, 'user:', user)
    
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
      console.log('[Conversation Memory Sync] No memory variable found')
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
          console.log('[Conversation Memory Sync] Failed to parse memory value, using empty object')
          incoming = {}
        }
      }
    }
    
    // If memory is an array, take the first element
    if (Array.isArray(incoming) && incoming.length > 0) {
      incoming = incoming[0]
    }
    
    console.log('[Conversation Memory Sync] Successfully parsed memory for conversation:', conversationId)
    
    const existing = await prisma.conversationMemory.findUnique({ where: { conversationId } })
    const current = existing ? JSON.parse(existing.memory) : {}
    const merged = replace ? incoming : deepMerge(current, incoming)
    const nextVersion = (existing?.version ?? 0) + 1

    const upserted = await prisma.conversationMemory.upsert({
      where: { conversationId },
      update: { memory: JSON.stringify(merged), version: nextVersion, userId: user },
      create: { conversationId, userId: user, memory: JSON.stringify(merged), version: nextVersion },
    })
    
    await prisma.conversationMemoryHistory.create({
      data: {
        conversationId,
        userId: user,
        version: nextVersion,
        snapshot: JSON.stringify(merged),
        source: 'dify_pull',
      },
    })

    return NextResponse.json({ 
      ok: true, 
      conversationId: upserted.conversationId, 
      userId: upserted.userId,
      version: upserted.version 
    })
  }
  catch (e: any) {
    console.error('[Conversation Memory Sync] Error:', e?.message || e)
    console.error('[Conversation Memory Sync] Stack:', e?.stack)
    return NextResponse.json({ error: e?.message || 'server error' }, { status: 500 })
  }
}
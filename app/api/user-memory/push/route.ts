import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { MEMORY_PUSH_TOKEN } from '@/config'

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

const parseMemory = (m: any) => {
  if (typeof m === 'string') {
    try {
      return JSON.parse(m)
    } catch {
      try {
        return JSON.parse(m.replace(/'/g, '"'))
      } catch {
        return {}
      }
    }
  }
  return m || {}
}

// POST /api/user-memory/push
// Headers: Authorization: Bearer <MEMORY_PUSH_TOKEN>
// Body: { user: string, conversation_id?: string, memory: object|string, source?: string, replace?: boolean }
export async function POST(req: NextRequest) {
  try {
    const auth = req.headers.get('authorization') || ''
    const token = auth.startsWith('Bearer ') ? auth.substring(7) : ''
    // If MEMORY_PUSH_TOKEN is set, enforce it; otherwise allow (dev/beta ease)
    if (MEMORY_PUSH_TOKEN && token !== MEMORY_PUSH_TOKEN)
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

    const body = await req.json()
    const { user, memory, conversation_id, source, replace } = body || {}
    if (!user)
      return NextResponse.json({ error: 'user is required' }, { status: 400 })
    if (!memory)
      return NextResponse.json({ error: 'memory is required' }, { status: 400 })

    const incoming = parseMemory(memory)
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
        source: source || 'push',
        conversationId: conversation_id || null,
      },
    })

    return NextResponse.json({ ok: true, userId: upserted.userId, version: upserted.version })
  }
  catch (e: any) {
    return NextResponse.json({ error: e?.message || 'server error' }, { status: 500 })
  }
}

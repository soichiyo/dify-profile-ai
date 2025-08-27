import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getInfo } from '@/app/api/utils/common'

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

export async function GET(req: NextRequest) {
  try {
    const { user } = getInfo(req)
    const record = await prisma.userMemory.findUnique({ where: { userId: user } })
    const payload = record ? { userId: record.userId, version: record.version, memory: JSON.parse(record.memory) } : { userId: user, version: 0, memory: {} }
    return NextResponse.json(payload)
  }
  catch (e: any) {
    return NextResponse.json({ error: e?.message || 'server error' }, { status: 500 })
  }
}

// Upsert and merge memory. Body: { memory: object, source?: string, conversation_id?: string, replace?: boolean }
export async function POST(req: NextRequest) {
  try {
    const { user } = getInfo(req)
    const body = await req.json()
    const { memory, source, conversation_id, replace } = body || {}
    if (!memory || typeof memory !== 'object')
      return NextResponse.json({ error: 'memory(object) is required' }, { status: 400 })

    const existing = await prisma.userMemory.findUnique({ where: { userId: user } })
    const currentMemory = existing ? JSON.parse(existing.memory) : {}
    const newMemory = replace ? memory : deepMerge(currentMemory, memory)
    const nextVersion = (existing?.version ?? 0) + 1

    const upserted = await prisma.userMemory.upsert({
      where: { userId: user },
      update: { memory: JSON.stringify(newMemory), version: nextVersion },
      create: { userId: user, memory: JSON.stringify(newMemory), version: nextVersion },
    })

    await prisma.userMemoryHistory.create({
      data: {
        userId: user,
        version: nextVersion,
        snapshot: JSON.stringify(newMemory),
        source: source || null,
        conversationId: conversation_id || null,
      },
    })

    return NextResponse.json({ userId: upserted.userId, version: upserted.version, memory: newMemory })
  }
  catch (e: any) {
    return NextResponse.json({ error: e?.message || 'server error' }, { status: 500 })
  }
}


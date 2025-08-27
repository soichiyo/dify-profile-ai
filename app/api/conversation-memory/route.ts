import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getInfo } from '@/app/api/utils/common'

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

// GET /api/conversation-memory?conversation_id=...
export async function GET(req: NextRequest) {
  try {
    const { user } = getInfo(req)
    const { searchParams } = new URL(req.url)
    const conversationId = searchParams.get('conversation_id')
    
    if (!conversationId)
      return NextResponse.json({ error: 'conversation_id is required' }, { status: 400 })

    const record = await prisma.conversationMemory.findUnique({ 
      where: { conversationId } 
    })
    
    const payload = record ? {
      conversationId: record.conversationId,
      userId: record.userId,
      version: record.version,
      memory: JSON.parse(record.memory),
      createdAt: record.createdAt,
      updatedAt: record.updatedAt
    } : {
      conversationId,
      userId: user,
      version: 0,
      memory: {},
      createdAt: null,
      updatedAt: null
    }
    
    return NextResponse.json(payload)
  }
  catch (e: any) {
    return NextResponse.json({ error: e?.message || 'server error' }, { status: 500 })
  }
}

// POST /api/conversation-memory
// Body: { conversation_id: string, memory: object, source?: string, replace?: boolean }
export async function POST(req: NextRequest) {
  try {
    const { user } = getInfo(req)
    const body = await req.json()
    const { conversation_id, memory, source, replace } = body || {}
    
    if (!conversation_id)
      return NextResponse.json({ error: 'conversation_id is required' }, { status: 400 })
    if (!memory || typeof memory !== 'object')
      return NextResponse.json({ error: 'memory(object) is required' }, { status: 400 })

    const existing = await prisma.conversationMemory.findUnique({ 
      where: { conversationId: conversation_id } 
    })
    const currentMemory = existing ? JSON.parse(existing.memory) : {}
    const newMemory = replace ? memory : deepMerge(currentMemory, memory)
    const nextVersion = (existing?.version ?? 0) + 1

    const upserted = await prisma.conversationMemory.upsert({
      where: { conversationId: conversation_id },
      update: { memory: JSON.stringify(newMemory), version: nextVersion, userId: user },
      create: { conversationId: conversation_id, userId: user, memory: JSON.stringify(newMemory), version: nextVersion },
    })

    await prisma.conversationMemoryHistory.create({
      data: {
        conversationId: conversation_id,
        userId: user,
        version: nextVersion,
        snapshot: JSON.stringify(newMemory),
        source: source || null,
      },
    })

    return NextResponse.json({ 
      conversationId: upserted.conversationId,
      userId: upserted.userId, 
      version: upserted.version, 
      memory: newMemory 
    })
  }
  catch (e: any) {
    return NextResponse.json({ error: e?.message || 'server error' }, { status: 500 })
  }
}
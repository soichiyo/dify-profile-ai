import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getInfo } from '@/app/api/utils/common'

// Save message (user question + assistant answer) after streaming completed
// Body: { message_id, conversation_id, query, answer }
export async function POST(req: NextRequest) {
  try {
    const { user } = getInfo(req)
    const body = await req.json()
    const { message_id, conversation_id, query, answer } = body || {}
    if (!message_id || !conversation_id)
      return NextResponse.json({ error: 'message_id and conversation_id are required' }, { status: 400 })

    await prisma.messageLog.upsert({
      where: { id: message_id },
      update: {
        conversationId: conversation_id,
        userId: user,
        query: query ?? undefined,
        answer: answer ?? undefined,
      },
      create: {
        id: message_id,
        conversationId: conversation_id,
        userId: user,
        role: 'assistant',
        query: query ?? undefined,
        answer: answer ?? undefined,
      },
    })
    return NextResponse.json({ ok: true })
  }
  catch (e: any) {
    return NextResponse.json({ error: e?.message || 'server error' }, { status: 500 })
  }
}

// GET /api/logs/message?limit=50&conversation_id=...&user_id=...
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = Number(searchParams.get('limit') || 50)
    const conversationId = searchParams.get('conversation_id') || undefined
    const userId = searchParams.get('user_id') || undefined

    const data = await prisma.messageLog.findMany({
      where: {
        ...(conversationId ? { conversationId } : {}),
        ...(userId ? { userId } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
    return NextResponse.json({ data })
  }
  catch (e: any) {
    return NextResponse.json({ error: e?.message || 'server error' }, { status: 500 })
  }
}

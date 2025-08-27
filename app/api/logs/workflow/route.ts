import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getInfo } from '@/app/api/utils/common'

// Save workflow run result
// Body: { workflow_run_id, conversation_id, message_id, status, error }
export async function POST(req: NextRequest) {
  try {
    const { user } = getInfo(req)
    const body = await req.json()
    const { workflow_run_id, conversation_id, message_id, status, error } = body || {}
    if (!workflow_run_id || !conversation_id || !message_id)
      return NextResponse.json({ error: 'workflow_run_id, conversation_id, message_id are required' }, { status: 400 })

    await prisma.workflowRunLog.upsert({
      where: { id: workflow_run_id },
      update: {
        conversationId: conversation_id,
        messageId: message_id,
        status,
        error: error ?? undefined,
      },
      create: {
        id: workflow_run_id,
        conversationId: conversation_id,
        messageId: message_id,
        status,
        error: error ?? undefined,
      },
    })

    return NextResponse.json({ ok: true, user })
  }
  catch (e: any) {
    return NextResponse.json({ error: e?.message || 'server error' }, { status: 500 })
  }
}

// GET /api/logs/workflow?limit=50&conversation_id=...&message_id=...
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = Number(searchParams.get('limit') || 50)
    const conversationId = searchParams.get('conversation_id') || undefined
    const messageId = searchParams.get('message_id') || undefined

    const data = await prisma.workflowRunLog.findMany({
      where: {
        ...(conversationId ? { conversationId } : {}),
        ...(messageId ? { messageId } : {}),
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

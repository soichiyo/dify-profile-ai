import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getInfo } from '@/app/api/utils/common'

export const dynamic = 'force-dynamic'

// GET /api/conversation-memory/history?conversation_id=...&limit=50
export async function GET(req: NextRequest) {
  try {
    if (!prisma) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }
    
    const { user } = getInfo(req)
    const { searchParams } = new URL(req.url)
    const conversationId = searchParams.get('conversation_id')
    const limit = parseInt(searchParams.get('limit') || '50')
    
    if (!conversationId)
      return NextResponse.json({ error: 'conversation_id is required' }, { status: 400 })

    const history = await prisma.conversationMemoryHistory.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
    
    const payload = history.map(record => ({
      id: record.id,
      conversationId: record.conversationId,
      userId: record.userId,
      version: record.version,
      snapshot: JSON.parse(record.snapshot),
      source: record.source,
      createdAt: record.createdAt,
    }))
    
    return NextResponse.json(payload)
  }
  catch (e: any) {
    console.error('[ConversationMemory History] Error:', e)
    return NextResponse.json({ error: e?.message || 'server error' }, { status: 500 })
  }
}
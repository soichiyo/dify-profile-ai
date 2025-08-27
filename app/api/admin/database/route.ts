import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET /api/admin/database?table=ConversationMemory&limit=10
export async function GET(req: NextRequest) {
  try {
    if (!prisma) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }
    
    const { searchParams } = new URL(req.url)
    const table = searchParams.get('table') || 'ConversationMemory'
    const limit = parseInt(searchParams.get('limit') || '10')
    
    let data: any[] = []
    let count = 0
    
    switch (table) {
      case 'ConversationMemory':
        data = await prisma.conversationMemory.findMany({
          orderBy: { updatedAt: 'desc' },
          take: limit,
        })
        count = await prisma.conversationMemory.count()
        break
      case 'ConversationMemoryHistory':
        data = await prisma.conversationMemoryHistory.findMany({
          orderBy: { createdAt: 'desc' },
          take: limit,
        })
        count = await prisma.conversationMemoryHistory.count()
        break
      case 'MessageLog':
        data = await prisma.messageLog.findMany({
          orderBy: { createdAt: 'desc' },
          take: limit,
        })
        count = await prisma.messageLog.count()
        break
      case 'UserMemory':
        data = await prisma.userMemory.findMany({
          orderBy: { updatedAt: 'desc' },
          take: limit,
        })
        count = await prisma.userMemory.count()
        break
      case 'WorkflowRunLog':
        data = await prisma.workflowRunLog.findMany({
          orderBy: { createdAt: 'desc' },
          take: limit,
        })
        count = await prisma.workflowRunLog.count()
        break
      case 'WorkflowNodeLog':
        data = await prisma.workflowNodeLog.findMany({
          orderBy: { createdAt: 'desc' },
          take: limit,
        })
        count = await prisma.workflowNodeLog.count()
        break
      default:
        return NextResponse.json({ error: 'Invalid table name' }, { status: 400 })
    }
    
    return NextResponse.json({
      table,
      count,
      limit,
      data: data.map(record => {
        // Parse JSON fields for display
        const parsed = { ...record }
        if (parsed.memory && typeof parsed.memory === 'string') {
          try {
            parsed.memory = JSON.parse(parsed.memory)
          } catch {}
        }
        if (parsed.snapshot && typeof parsed.snapshot === 'string') {
          try {
            parsed.snapshot = JSON.parse(parsed.snapshot)
          } catch {}
        }
        return parsed
      })
    })
  }
  catch (e: any) {
    console.error('[Database Admin] Error:', e)
    return NextResponse.json({ error: e?.message || 'server error' }, { status: 500 })
  }
}

// POST /api/admin/database - Initialize tables
export async function POST(req: NextRequest) {
  try {
    if (!prisma) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }
    
    const body = await req.json()
    const { action } = body
    
    if (action === 'migrate') {
      // This would typically be handled by Prisma migrate
      return NextResponse.json({ 
        message: 'Migration should be handled by Prisma. Run: npx prisma migrate deploy' 
      })
    }
    
    if (action === 'status') {
      const tables = {
        conversationMemory: await prisma.conversationMemory.count(),
        conversationMemoryHistory: await prisma.conversationMemoryHistory.count(),
        messageLog: await prisma.messageLog.count(),
        userMemory: await prisma.userMemory.count(),
        workflowRunLog: await prisma.workflowRunLog.count(),
        workflowNodeLog: await prisma.workflowNodeLog.count(),
      }
      
      return NextResponse.json({ tables })
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  }
  catch (e: any) {
    console.error('[Database Admin] Error:', e)
    return NextResponse.json({ error: e?.message || 'server error' }, { status: 500 })
  }
}
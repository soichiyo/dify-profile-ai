import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// Save workflow node event (usually on node_finished)
// Body: { run_id, node_id, title, status, error }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { run_id, node_id, title, status, error } = body || {}
    if (!run_id || !node_id)
      return NextResponse.json({ error: 'run_id and node_id are required' }, { status: 400 })

    await prisma.workflowNodeLog.create({
      data: {
        runId: run_id,
        nodeId: node_id,
        title: title ?? undefined,
        status,
        error: error ?? undefined,
      },
    })
    return NextResponse.json({ ok: true })
  }
  catch (e: any) {
    return NextResponse.json({ error: e?.message || 'server error' }, { status: 500 })
  }
}

// GET /api/logs/node?limit=100&run_id=...
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = Number(searchParams.get('limit') || 100)
    const runId = searchParams.get('run_id') || undefined

    const data = await prisma.workflowNodeLog.findMany({
      where: { ...(runId ? { runId } : {}) },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
    return NextResponse.json({ data })
  }
  catch (e: any) {
    return NextResponse.json({ error: e?.message || 'server error' }, { status: 500 })
  }
}

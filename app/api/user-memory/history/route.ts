import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getInfo } from '@/app/api/utils/common'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { user } = getInfo(req)
    const { searchParams } = new URL(req.url)
    const limit = Number(searchParams.get('limit') || 50)
    const data = await prisma.userMemoryHistory.findMany({
      where: { userId: user },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
    // parse snapshot JSON strings lazily
    const parsed = data.map(d => ({ ...d, snapshot: (() => { try { return JSON.parse(d.snapshot) } catch { return {} } })() }))
    return NextResponse.json({ data: parsed })
  }
  catch (e: any) {
    return NextResponse.json({ error: e?.message || 'server error' }, { status: 500 })
  }
}


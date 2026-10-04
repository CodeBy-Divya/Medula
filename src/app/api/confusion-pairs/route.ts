import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

/**
 * GET /api/confusion-pairs?id=cf-11
 * Returns a single confusion pair (client type mirror of the Prisma model):
 * { id, a, b, aCode, bCode, aPoints, bPoints, mnemonic, subjectCode }
 * Used by the quiz results screen to show the pair-debrief comparison table.
 */
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'Missing id param' }, { status: 400 })
  }
  const pair = await db.confusionPair.findUnique({ where: { id } })
  if (!pair) {
    return NextResponse.json({ error: 'Unknown confusion pair' }, { status: 404 })
  }
  return NextResponse.json({
    pair: {
      id: pair.id,
      a: pair.a,
      b: pair.b,
      aCode: pair.aCode,
      bCode: pair.bCode,
      aPoints: pair.aPoints as string[],
      bPoints: pair.bPoints as string[],
      mnemonic: pair.mnemonic,
      subjectCode: pair.subjectCode,
    },
  })
}

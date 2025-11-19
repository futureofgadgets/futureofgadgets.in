import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id: orderId } = await context.params

  try {
    const user = await prisma.user.findFirst({ where: { email: session.user.email } })
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const order = await prisma.order.findFirst({ where: { id: orderId } })
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (order.status !== 'delivered') {
      return NextResponse.json({ error: 'Only delivered orders can be refunded' }, { status: 400 })
    }

    const { transactionId } = await req.json()
    if (!transactionId?.trim()) {
      return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 })
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { refundTransactionId: transactionId.trim(), updatedAt: new Date() }
    })

    return NextResponse.json({ success: true, order: updatedOrder })
  } catch (error) {
    console.error('Refund error:', error)
    return NextResponse.json({ error: 'Failed to process refund' }, { status: 500 })
  }
}

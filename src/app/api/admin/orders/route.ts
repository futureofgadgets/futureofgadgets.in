import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || (session.user?.role !== 'admin' && session.user?.email !== 'admin@electronic.com')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    console.log('Fetching orders for admin:', session.user?.email)
    
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log('Found orders:', orders.length)
    return NextResponse.json({ orders })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ 
      error: "Failed to fetch orders",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || (session.user?.role !== 'admin' && session.user?.email !== 'admin@electronic.com')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const { orderId, status, billUrl } = await request.json()
    
    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 })
    }
    
    const updateData: any = {}
    if (status) updateData.status = status
    if (billUrl) updateData.billUrl = billUrl
    
    console.log('Updating order:', orderId, 'with data:', updateData)
    
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      }
    })

    console.log('Order updated successfully:', updatedOrder.id)
    return NextResponse.json({ order: updatedOrder })
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json({ 
      error: "Failed to update order",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
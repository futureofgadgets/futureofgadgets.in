import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  
  const orders = await prisma.order.findMany({ where: { userId: session.user.id } })
  return NextResponse.json({ orders })
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  
  const body = await request.json()
  const { items, address, paymentMethod, deliveryDate } = body

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "No items provided" }, { status: 400 })
  }

  const orderItems = []
  let total = 0

  for (const it of items) {
    const product = await prisma.product.findUnique({ where: { id: it.productId } })
    if (!product) return NextResponse.json({ error: `Invalid product ${it.productId}` }, { status: 400 })
    
    const orderItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      qty: Math.max(1, Math.floor(it.qty || 1))
    }
    orderItems.push(orderItem)
    total += orderItem.price * orderItem.qty
  }

  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      items: orderItems,
      total,
      status: paymentMethod === "cod" ? "pending" : "paid",
      address,
      paymentMethod,
      deliveryDate: new Date(deliveryDate)
    }
  })

  return NextResponse.json({ order }, { status: 201 })
}

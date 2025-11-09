import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { uploadToCloudinary } from '@/lib/cloudinary'

const prisma = new PrismaClient()

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const formData = await request.formData()
    const file = formData.get('image') as File | null
    const customerName = formData.get('customerName') as string
    const message = formData.get('message') as string
    const rating = formData.get('rating') as string
    const ratingCount = formData.get('ratingCount') as string
    
    let imageUrl: string | undefined
    
    if (file) {
      imageUrl = await uploadToCloudinary(file)
    }
    
    const updateData: any = {
      customerName,
      message,
      rating: Number(rating),
      ratingCount: Number(ratingCount)
    }
    
    if (imageUrl) updateData.imageUrl = imageUrl
    
    const review = await prisma.customerReview.update({
      where: { id },
      data: updateData
    })
    
    return NextResponse.json({ success: true, review })
  } catch (error: any) {
    console.error('Update review error:', error)
    return NextResponse.json({ error: error.message || 'Failed to update' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.customerReview.delete({ where: { id } })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}

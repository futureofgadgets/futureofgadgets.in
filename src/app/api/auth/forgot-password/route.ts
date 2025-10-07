import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { generateVerificationCode, generateCodeExpiry, sendEmail, getPasswordResetEmailTemplate } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    const user = await prisma.user.findFirst({ 
      where: { 
        email, 
        provider: 'credentials' 
      } 
    })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const code = generateVerificationCode()
    const expires = generateCodeExpiry()
    const hashedCode = await bcrypt.hash(code, 4)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: hashedCode,
        resetPasswordExpires: expires
      }
    })

    sendEmail(
      email,
      'Reset your password - Electronic Web',
      getPasswordResetEmailTemplate(code, email)
    ).catch(err => console.log('⚠️ Email send failed:', err.message))

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send reset email' }, { status: 500 })
  }
}

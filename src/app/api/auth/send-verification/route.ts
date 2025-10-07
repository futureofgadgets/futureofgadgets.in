import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateVerificationCode, generateCodeExpiry, sendEmail, getVerificationEmailTemplate } from '@/lib/email'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    const user = await prisma.user.findFirst({ where: { email, provider: 'credentials' } })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (user.emailVerified) {
      return NextResponse.json({ error: 'Email already verified' }, { status: 400 })
    }

    const code = generateVerificationCode()
    const expires = generateCodeExpiry()
    const hashedCode = await bcrypt.hash(code, 4)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken: hashedCode,
        emailVerificationExpires: expires
      }
    })

    sendEmail(
      email,
      'Verify your email - Electronic Web',
      getVerificationEmailTemplate(code, email)
    ).catch(err => console.log('⚠️ Email send failed:', err.message))

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send verification email' }, { status: 500 })
  }
}

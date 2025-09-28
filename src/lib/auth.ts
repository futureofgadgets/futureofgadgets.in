import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        
        // Default admin for development
        if (credentials.email === 'admin@electronic.com' && credentials.password === 'admin123') {
          return {
            id: '1',
            email: 'admin@electronic.com',
            name: 'Admin',
            role: 'admin'
          }
        }
        
        // Mock user authentication
        return {
          id: '2',
          email: credentials.email,
          name: 'User',
          role: 'user'
        }
      }
    })
  ],
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/auth/signin'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role || (user.email === 'admin@electronic.com' ? 'admin' : 'user')
      }
      return token
    },
    async session({ session, token }) {
      session.user.role = token.role as string
      return session
    },
    async signIn({ user, account }) {
      return true
    }
  }
}
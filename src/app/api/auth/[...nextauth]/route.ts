import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { db } from '@/lib/db'

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Admin',
      credentials: {
        password: { label: 'Contraseña', type: 'password' },
      },
      async authorize(credentials) {
        const envPassword = process.env.ADMIN_PASSWORD || 'admin123'

        let adminPassword = envPassword
        try {
          const setting = await db.setting.findUnique({ where: { key: 'admin_password' } })
          if (setting?.value) adminPassword = setting.value
        } catch { /* use env fallback */ }

        if (credentials?.password === adminPassword) {
          return {
            id: 'admin',
            name: 'Administrador',
            email: 'admin@portfolio.dev',
          }
        }
        return null
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60,
  },
  pages: {
    signIn: '/admin',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: false,
  // cookies: {
  //   sessionToken: {
  //     name: `__Secure-next-auth.session-token`,
  //     options: {
  //       httpOnly: true,
  //       sameSite: 'lax',
  //       path: '/',
  //       secure: true,
  //     },
  //   },
  //   callbackUrl: {
  //     name: `__Secure-next-auth.callback-url`,
  //     options: {
  //       sameSite: 'lax',
  //       path: '/',
  //       secure: true,
  //     },
  //   },
  //   csrfToken: {
  //     name: `__Host-next-auth.csrf-token`,
  //     options: {
  //       httpOnly: true,
  //       sameSite: 'lax',
  //       path: '/',
  //       secure: true,
  //     },
  //   },
  // },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = 'admin'
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role
      }
      return session
    },
  },
})

export { handler as GET, handler as POST }

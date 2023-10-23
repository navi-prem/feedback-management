// @ts-nocheck
import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import prisma from '../../../../../prisma/prisma.ts'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
        if (account.provider === "google") {

            const s = await prisma.student.findFirst({
                where: { email: profile.email }
            })
            user.email = { info: s, isStudent: true }

            if (s) return profile.email_verified && profile.email.endsWith('@citchennai.net')

            const t = await prisma.teacher.findFirst({
                where: { email: profile.email },
                include: { as_HOD: true }
            })
            t.dept = t.as_HOD
            delete t.as_HOD
            user.email = { info: t, isStudent: false }
            t.isHOD = t.dept.HOD_id === t.id
            t.dept = t.dept.name

            return profile.email_verified && profile.email.endsWith('@citchennai.net')
        }
        return true
    },
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Username / Email", type: "text", placeholder: "shubham" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter your username/email and password");
        }

        const input = credentials.email.trim();
        const inputLower = input.toLowerCase();
        const usernameOnly = inputLower.split("@")[0];

        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: inputLower },
              { email: input },
              { name: input },
              { name: inputLower },
              { email: usernameOnly },
              { name: usernameOnly },
            ],
          },
        });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const email = user.email?.toLowerCase();
        if (!email) return false;

        try {
          let dbUser = await prisma.user.findFirst({
            where: { email },
          });

          if (!dbUser) {
            const dummyPassword = await bcrypt.hash(Math.random().toString(36), 10);
            dbUser = await prisma.user.create({
              data: {
                email,
                name: user.name || "Shubham Sharma",
                password: dummyPassword,
                role: "admin",
              },
            });
          }

          user.id = dbUser.id;
          (user as any).role = dbUser.role || "admin";
          return true;
        } catch (err) {
          console.error("Google sign-in database sync error:", err);
          (user as any).role = "admin";
          return true;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "admin";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

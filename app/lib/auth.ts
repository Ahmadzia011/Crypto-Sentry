import { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./prisma";

// This file centralizes the app's sign-in providers and ensures that a user record exists once authentication succeeds.
export const authOptions: NextAuthOptions = {
  providers: [
    // Email provider enables passwordless magic-link sign-in for users who prefer a mail-based flow.
    ...(process.env.EMAIL_SERVER_HOST && process.env.EMAIL_FROM
      ? [
          EmailProvider({
            server: {
              host: process.env.EMAIL_SERVER_HOST,
              port: Number(process.env.EMAIL_SERVER_PORT || 587),
              auth: {
                user: process.env.EMAIL_SERVER_USER,
                pass: process.env.EMAIL_SERVER_PASSWORD,
              },
            },
            from: process.env.EMAIL_FROM,
          }),
        ]
      : []),

    // Google provider adds a quick OAuth-based sign-in experience for users with a Google account.
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],

  callbacks: {
    // Create a user record on first successful sign-in, but never create duplicates.
    async signIn({ user }) {
      if (!user?.email) {
        return true;
      }

      const normalizedEmail = user.email.toLowerCase().trim();
      const displayName = user.name?.trim() || null;

      await prisma.user.upsert({ //it will create a new record if not present otherwise update the existing
        where: { email: normalizedEmail },
        update: displayName ? { name: displayName } : {},
        create: {
          email: normalizedEmail,
          name: displayName,
        },
      });

      return true;
    },
  },

  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};
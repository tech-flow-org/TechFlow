﻿import NextAuth, { CallbacksOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

export const authOptions = {
  secret: process.env.NEXT_AUTH_SECRET,
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user = {
          ...session.user,
          ...user,
        };
      }
      return session;
    },
  } as Partial<CallbacksOptions>,
  providers: [
    GithubProvider({
      clientId: process.env.AUTH_GITHUB_ID || '',
      clientSecret: process.env.AUTH_GITHUB_SECRET || '',
      profile(profile) {
        return {
          id: profile.login,
          name: profile.name ?? profile.login,
          email: profile.email,
          image: profile.avatar_url,
        };
      },
    }),
  ],
};

export default NextAuth(authOptions);

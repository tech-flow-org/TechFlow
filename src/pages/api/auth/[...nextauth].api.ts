import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || 'Iv1.ef859671fdf9841a',
      clientSecret: process.env.GITHUB_SECRET || '98cb757a9515c76c89fabd72b63b23bb2d35bc7a',
    }),
  ],
};

export default NextAuth(authOptions);

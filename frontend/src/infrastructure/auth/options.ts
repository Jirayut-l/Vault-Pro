import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/v1/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!res.ok) {
            console.log("error /api/v1/auth/login");
            return null;
          }

          const responseData = await res.json();
          if (responseData && responseData.success && responseData.data?.access_token) {
            const accessToken = responseData.data.access_token;
            let userId = 'unknown';

            try {
              const payloadPart = accessToken.split('.')[1];
              if (payloadPart) {
                const base64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
                const decoded = JSON.parse(
                  typeof Buffer !== 'undefined'
                    ? Buffer.from(base64, 'base64').toString('utf-8')
                    : atob(base64)
                );
                if (decoded && decoded.user_id) {
                  userId = decoded.user_id;
                }
              }
            } catch (err) {
              console.error('Failed to decode access token:', err);
            }

            return {
              id: userId,
              email: credentials.email,
              accessToken: accessToken,
            };
          }
          return null;
        } catch (error) {
          console.error('Authorize error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).accessToken;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        (session as any).accessToken = token.accessToken;
        if (session.user) {
          (session.user as any).id = token.id;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || 'vault-pro-jwt-secret-key-123456789',
};
export default authOptions;

import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const authOptions: NextAuthOptions = {
  providers: [
    // Email/Password authentication via backend API
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        try {
          const response = await axios.post(`${API_URL}/api/v1/auth/login`, {
            email: credentials.email,
            password: credentials.password,
          });

          const data = response.data;
          const user = data.data || data.user || data;

          if (user) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
              tenantId: user.tenantId,
              farmerId: user.farmerId,
              avatar: user.avatar,
              accessToken: user.accessToken || user.token,
            };
          }

          return null;
        } catch (error: any) {
          const message = error.response?.data?.message || 'Invalid credentials';
          throw new Error(message);
        }
      },
    }),
    // Google OAuth - requires GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET env vars
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    // GitHub OAuth - requires GITHUB_ID and GITHUB_SECRET env vars
    GitHubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile, trigger }) {
      // Handle session.update() — re-fetch user profile from backend
      // so the session reflects the updated role/tenant after OAuth setup
      if (trigger === 'update') {
        try {
          const response = await axios.get(`${API_URL}/api/v1/auth/me`, {
            headers: { Authorization: `Bearer ${token.accessToken}` },
          });
          const data = response.data;
          const userData = data.data || data.user || data;
          if (userData) {
            token.role = userData.role || token.role;
            token.tenantId = userData.tenantId || token.tenantId;
            token.farmerId = userData.farmerId;
            token.needsSetup = false;
            token.avatar = userData.avatar || token.avatar;
          }
        } catch {
          // Re-fetch failed — keep existing token values
        }
        return token;
      }

      if (user) {
        token.id = user.id;
        token.avatar = (user as any).avatar || (profile as any)?.picture;
        
        // For OAuth users (Google/GitHub), fetch/create user from backend
        if (account?.provider === 'google' || account?.provider === 'github') {
          try {
            // Call backend OAuth callback to create or fetch the user
            // with proper role, tenantId, and permissions
            const response = await axios.post(
              `${API_URL}/api/v1/auth/oauth/callback`,
              {
                email: user.email,
                name: user.name,
                avatar: token.avatar,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
              }
            );

            const data = response.data;
            const userData = data.data || data.user || data;

            token.role = userData.role || 'FARMER';
            token.tenantId = userData.tenantId || '';
            token.farmerId = userData.farmerId;
            // Use backend-issued token if available, otherwise fall back to OAuth access token
            token.accessToken = userData.accessToken || userData.token || account.access_token || '';
            token.id = userData.id || user.id;
            // Flag indicating the user needs to complete setup (choose role/tenant)
            token.needsSetup = userData.needsSetup === true;
          } catch (error) {
            // Backend OAuth callback failed — set sensible defaults so the
            // user can still browse. They may need to complete registration.
            console.error('OAuth callback failed:', error);
            token.role = 'FARMER';
            token.tenantId = '';
            token.farmerId = undefined;
            token.accessToken = account.access_token || '';
            token.needsSetup = true; // Treat as needing setup since backend was unreachable
          }
        } else {
          // Credentials provider - data comes from backend API login response
          token.role = (user as any).role;
          token.tenantId = (user as any).tenantId;
          token.farmerId = (user as any).farmerId;
          token.accessToken = (user as any).accessToken;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as string) || 'FARMER';
        session.user.tenantId = (token.tenantId as string) || '';
        session.user.farmerId = token.farmerId as string | undefined;
        session.accessToken = (token.accessToken as string) || '';
        (session.user as any).avatar = token.avatar as string;
        (session.user as any).needsSetup = (token as any).needsSetup === true;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
    newUser: '/register',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

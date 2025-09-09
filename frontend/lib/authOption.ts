import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";
import { readIdFromJwt, readNameFromJwt, readRoleFromJwt } from "@/lib/auth";

const API_BASE_URL =
  process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

interface DecodedJWT {
  sub: string;
  role: string;
  exp: number;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        try {
          const res = await fetch(`${API_BASE_URL}/api/auth/authenticate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password,
            }),
          });

          if (!res.ok) {
            return null;
          }

          const data = await res.json();

          const username = readNameFromJwt(data.access_token);
          const role = readRoleFromJwt(data.access_token);
          const userId = readIdFromJwt(data.access_token);

          if (!username || !role) return null;

          return {
            id: username,
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            username,
            role,
            userId,
          };
        } catch (error) {
          console.error("🔥 Error in authorize:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const typedUser = user as unknown as {
          accessToken: string;
          refreshToken: string;
          username: string;
          role: string;
          userId: number;
        };
        const decoded = jwtDecode<DecodedJWT>(typedUser.accessToken);

        token.accessToken = typedUser.accessToken;
        token.refreshToken = typedUser.refreshToken;
        token.username = typedUser.username;
        token.role = typedUser.role;
        token.accessTokenExpires = decoded.exp * 1000;
        token.userId = typedUser.userId;
      }

      // Check if token is still valid
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      // TODO: refresh token flow
      return token;
    },

    async session({ session, token }) {
      session.user = {
        username: token.username as string,
        role: token.role as string,
        accessToken: token.accessToken as string,
        userId: token.userId as number,
      };
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

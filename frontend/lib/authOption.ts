import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";
import { readIdFromJwt, readNameFromJwt, readRoleFromJwt } from "@/lib/auth";
import { DecodedJWT } from "@/types/auth";

const API_BASE_URL =
  process.env.AUTH_API_BASE_URL || process.env.NEXT_PUBLIC_AUTH_API_BASE_URL;

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Emali", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        try {
          const res = await fetch(`${API_BASE_URL}/api/Auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!res.ok) {
            return null;
          }

          const data = await res.json();

          const username = readNameFromJwt(data.token);
          const role = readRoleFromJwt(data.token);
          const userId = readIdFromJwt(data.token);

          if (!username || !role) return null;

          return {
            id: username,
            accessToken: data.token,
            username,
            role,
            userId,
          };
        } catch (error) {
          console.error("Error in authorize:", error);
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
          username: string;
          role: string;
        };
        const decoded = jwtDecode<DecodedJWT>(typedUser.accessToken);

        token.accessToken = typedUser.accessToken;
        token.role = typedUser.role;
        token.accessTokenExpires = decoded.exp * 1000;
      }

      // Check if token is still valid
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      return token;
    },

    async session({ session, token }) {
      session.user = {
        role: token.role as string,
        accessToken: token.accessToken as string,
        userId: token.userId as number,
        subscription: token.subscription as string,
        accessTokenExpires: token.accessTokenExpires as number,
      };
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

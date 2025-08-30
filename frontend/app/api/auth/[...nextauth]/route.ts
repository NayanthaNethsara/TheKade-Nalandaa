// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  // Use JWT for session instead of database
  session: {
    strategy: "jwt",
  },

  // Callbacks to include custom info in token/session
  callbacks: {
    async jwt({ token, account, profile }) {
      // When first signing in, attach access_token and user info
      if (account && profile) {
        token.accessToken = account.access_token;
        token.id = profile.sub; // Google user ID
        token.email = profile.email;
        token.name = profile.name;
        token.picture = profile.picture;
      }
      return token;
    },
    async session({ session, token }) {
      // Include custom fields in session object
      session.user.id = token.id as string;
      session.user.email = token.email as string;
      session.user.name = token.name as string;
      session.user.image = token.picture as string;
      session.accessToken = token.accessToken as string;
      return session;
    },
  },

  // Optional: configure pages
  // pages: {
  //   signIn: "/auth/signin", // custom sign-in page (optional)
  //   error: "/auth/error", // error page
  // },

  // Optional: debug logs
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

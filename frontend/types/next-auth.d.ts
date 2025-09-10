import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      accessToken: string;
      role: string;
      subscription: string;
      userId: number;
      accessTokenExpires: number;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    role: string;
    subscription: string;
    userId: number;
    accessTokenExpires: number;
  }
}

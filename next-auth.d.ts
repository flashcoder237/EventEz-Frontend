import "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role?: string;
    };
    accessToken?: string;
    refreshToken?: string;
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    role?: string;
    accessToken?: string;
    refreshToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email?: string;
    name?: string;
    role?: string;
    accessToken?: string;
    refreshToken?: string;
  }
}
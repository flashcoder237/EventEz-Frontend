import "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Extension du type Session de NextAuth
   */
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    user: {
      id?: string;
      name?: string;
      email?: string;
      role?: 'user' | 'organizer' | 'admin';
    };
    error?: string;
  }

  /**
   * Extension du type User de NextAuth
   */
  interface User {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'organizer' | 'admin';
    accessToken: string;
    refreshToken: string;
  }
}

declare module "next-auth/jwt" {
  /**
   * Extension du type JWT de NextAuth
   */
  interface JWT {
    id?: string;
    name?: string;
    email?: string;
    role?: 'user' | 'organizer' | 'admin';
    accessToken?: string;
    refreshToken?: string;
    exp?: number;
    error?: string;
  }
}
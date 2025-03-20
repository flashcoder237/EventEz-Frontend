import "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
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
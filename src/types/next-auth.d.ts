// src/types/next-auth.d.ts
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string; // JWT sub dari Authentik
      username: string; // preferred_username
      role: string; // resolved dari groups
      groups: string[]; // raw groups dari Authentik
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sub: string;
    username: string;
    role: string;
    groups: string[];
  }
}

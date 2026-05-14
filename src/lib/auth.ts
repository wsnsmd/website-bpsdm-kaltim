// src/lib/auth.ts
import NextAuth from "next-auth";
import type { OAuthConfig, OAuthUserConfig } from "next-auth/providers";
import { db, eq } from "@/db";
import { users } from "@/db/schema";
import { resolveRoleFromGroups } from "@/lib/auth-helpers";

interface AuthentikProfile {
  sub: string;
  iss: string;
  aud: string | string[];
  exp: number;
  iat: number;
  email: string;
  email_verified: boolean;
  name: string;
  given_name: string;
  family_name: string;
  preferred_username: string;
  nickname: string;
  groups: string[];
}

function AuthentikProvider(
  config: OAuthUserConfig<AuthentikProfile>,
): OAuthConfig<AuthentikProfile> {
  const issuer = process.env.AUTH_AUTHENTIK_ISSUER!;
  return {
    id: "authentik",
    name: "Authentik SSO",
    type: "oidc",
    issuer,
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    authorization: {
      params: { scope: "openid email profile" },
    },
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: null,
      };
    },
  };
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,

  providers: [
    AuthentikProvider({
      clientId: process.env.AUTH_AUTHENTIK_CLIENT_ID!,
      clientSecret: process.env.AUTH_AUTHENTIK_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60,
  },

  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        const p = profile as unknown as AuthentikProfile;
        const groups = Array.isArray(p.groups) ? p.groups : [];
        const role = resolveRoleFromGroups(groups);

        // Upsert user ke DB
        await upsertUser({
          sub: p.sub,
          username: p.preferred_username ?? p.nickname ?? "",
          name: p.name ?? "",
          givenName: p.given_name ?? "",
          familyName: p.family_name ?? "",
          email: p.email ?? "",
          emailVerified: p.email_verified ?? false,
          authentikGroups: groups,
          role,
        });

        token.sub = p.sub;
        token.username = p.preferred_username ?? "";
        token.name = p.name ?? "";
        token.email = p.email ?? "";
        token.groups = groups;
        token.role = role;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.sub ?? "";
      session.user.name = token.name as string;
      session.user.email = token.email as string;
      // @ts-ignore
      session.user.username = token.username;
      // @ts-ignore
      session.user.groups = token.groups;
      // @ts-ignore
      session.user.role = token.role;
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },
});

async function upsertUser(data: {
  sub: string;
  username: string;
  name: string;
  givenName: string;
  familyName: string;
  email: string;
  emailVerified: boolean;
  authentikGroups: string[];
  role: string;
}) {
  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.sub, data.sub))
    .limit(1);

  const groupsJson = JSON.stringify(data.authentikGroups);
  const now = new Date();

  if (existing.length > 0) {
    await db
      .update(users)
      .set({
        username: data.username,
        name: data.name,
        givenName: data.givenName,
        familyName: data.familyName,
        email: data.email,
        emailVerified: data.emailVerified,
        authentikGroups: groupsJson,
        role: data.role as any,
        lastLoginAt: now,
      })
      .where(eq(users.sub, data.sub));
  } else {
    await db.insert(users).values({
      id: crypto.randomUUID(),
      sub: data.sub,
      username: data.username,
      name: data.name,
      givenName: data.givenName,
      familyName: data.familyName,
      email: data.email,
      emailVerified: data.emailVerified,
      authentikGroups: groupsJson,
      role: data.role as any,
      status: "active",
      lastLoginAt: now,
    });
  }
}

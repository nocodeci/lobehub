import { NextAuthOptions, DefaultSession } from "next-auth";
import { prisma } from "./prisma";

import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
    interface Session extends DefaultSession {
        user: {
            id: string;
        } & DefaultSession["user"];
    }

    interface User {
        id: string;
    }
}

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    cookies: {
        sessionToken: {
            name: `wozif.session-token`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: process.env.NODE_ENV === "production",
            },
        },
    },
    pages: {
        signIn: "http://localhost:3012/auth/login",
    },
    providers: [
        CredentialsProvider({
            name: "Wozif ID",
            credentials: {},
            async authorize() {
                return null;
            }
        })
    ], // No local login needed, we share the portal cookie
    callbacks: {
        async session({ token, session }) {
            console.log("NextAuth Session Callback - Token:", token ? "Present" : "Missing");
            if (token && session.user) {
                session.user.id = token.id as string;
                session.user.name = token.name;
                session.user.email = token.email;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                return {
                    ...token,
                    id: user.id,
                };
            }
            return token;
        },
    },
};

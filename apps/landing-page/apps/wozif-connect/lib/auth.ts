import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

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
        signIn: `${process.env.NEXT_PUBLIC_ACCOUNT_PORTAL_URL || 'http://localhost:3012'}/auth/login`,
    },
    providers: [
        CredentialsProvider({
            name: "Wozif ID",
            credentials: {},
            async authorize() {
                // No local login needed, we share the portal cookie
                return null;
            }
        })
    ],
    callbacks: {
        async session({ token, session }) {
            if (token && session.user) {
                (session.user as any).id = token.id as string;
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

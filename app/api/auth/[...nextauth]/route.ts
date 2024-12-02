import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { sql } from "@/lib/db";
import { compare } from "bcryptjs";
import { JWT } from "next-auth/jwt";

// Extend the built-in session types
declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            email: string;
            name: string;
            role?: string;
        };
    }

    interface User {
        id: string;
        email: string;
        name: string;
        role: string;
    }
}

// Extend the built-in token types
declare module "next-auth/jwt" {
    interface JWT {
        role?: string;
    }
}

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Please enter your email and password");
                }

                try {
                    const result = await sql`
            SELECT * FROM admins WHERE email = ${credentials.email}
          `;

                    const admin = result[0];
                    if (!admin) {
                        throw new Error("Invalid email or password");
                    }

                    const isValid = await compare(
                        credentials.password,
                        admin.password_hash
                    );
                    if (!isValid) {
                        throw new Error("Invalid email or password");
                    }

                    return {
                        id: admin.id.toString(),
                        email: admin.email,
                        name: admin.name,
                        role: "admin",
                    };
                } catch (error) {
                    console.error("Auth error:", error);
                    throw error;
                }
            },
        }),
    ],
    pages: {
        signIn: "/auth/signin",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session?.user) {
                session.user.role = token.role;
            }
            return session;
        },
    },
    session: {
        strategy: "jwt",
    },
});

export { handler as GET, handler as POST };

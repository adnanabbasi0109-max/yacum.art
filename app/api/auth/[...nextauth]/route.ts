import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { MongoClient } from "mongodb";

// Only connect to MongoDB when URI is provided
const clientPromise = process.env.MONGODB_URI
  ? new MongoClient(process.env.MONGODB_URI).connect()
  : undefined;

// Build providers list conditionally based on available env vars
const providers: Parameters<typeof NextAuth>[0]["providers"] = [];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

if (process.env.MONGODB_URI && process.env.RESEND_API_KEY) {
  providers.push(
    EmailProvider({
      server: {
        host: "smtp.resend.com",
        port: 465,
        auth: {
          user: "resend",
          pass: process.env.RESEND_API_KEY,
        },
      },
      from: "noreply@yacum.art",
    })
  );
}

// Fallback provider for dev — allows NextAuth to initialize without errors
if (providers.length === 0) {
  providers.push(
    CredentialsProvider({
      name: "Dev Login",
      credentials: {
        email: { label: "Email", type: "email" },
      },
      async authorize(credentials) {
        if (credentials?.email) {
          return {
            id: "dev-user",
            email: credentials.email as string,
            name: "Dev User",
          };
        }
        return null;
      },
    })
  );
}

const handler = NextAuth({
  ...(clientPromise ? { adapter: MongoDBAdapter(clientPromise) } : {}),
  providers,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days — user stays logged in
  },
  secret: process.env.NEXTAUTH_SECRET || "dev-secret-change-me",
  pages: {
    signIn: "/account",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };

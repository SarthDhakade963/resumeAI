// use next-auth rahter than @auth/core
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { NextAuthOptions } from "next-auth";
import LinkedInProvider from "next-auth/providers/linkedin";
import CredentialsProvider from "next-auth/providers/credentials";
interface AuthUser {
  id: string;
  username: string;
  email: string;
}

console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
console.log("GOOGLE_CLIENT_ID:", !!process.env.GOOGLE_CLIENT_ID);
console.log("GOOGLE_CLIENT_SECRET:", !!process.env.GOOGLE_CLIENT_SECRET);

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      // ! tells the ts that this value might look like it could be undefined, but at runtime it wont.
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "text" },
      },
      async authorize(
        credentials
      ): Promise<(AuthUser & { accessToken?: string }) | null> {
        if (!credentials?.email || !credentials.password) return null;
        try {
          const res = await fetch(
            `http://backend:8080/auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );

          console.log("Response status:", res.status);

          if (!res.ok) {
            const text = await res.text();
            console.error("Login failed response text:", text);
            return null;
          }

          const user = await res.json();

          console.log("User from backend:", user);

          if (!user?.id || !user?.email) return null;

          // user must contain id, name and emai
          return {
            id: user.id,
            username: user.username,
            email: user.email,
            accessToken: user.accessToken,
          };
        } catch (error) {
          console.error("Credentials auth error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // token — the persistent JWT payload
    // This is your custom NextAuth JWT object.
    // It is passed every time the jwt callback runs — both on login and on subsequent requests.
    // Its where you can store extra fields (like your Spring JWT) so they persist between requests.

    // account — OAuth or credentials account info
    // Only available during the initial sign-in.
    // Tells you how the user logged in (provider, providerAccountId, type, etc.).
    // If user is already signed in and the JWT is just being refreshed, account will be undefined.

    // user — basic profile from provider or authorize()
    // Only exists on the first login.
    // If CredentialsProvider, this is whatever your authorize() function returned.
    // If OAuth, this is a basic user object { id, name, email, image } extracted from the provider profile.

    // profile — full profile data from provider
    // Only exists for OAuth logins during first sign-in.
    // This is the raw profile data returned from the providers API.
    // Often has extra info like locale, verified_email, picture, etc.
    // Useful if you need to send this info to your backend for account linking.

    async jwt({ token, account, user, profile }) {
      // how the frontend will send this Spring JWT via NextAuth so the whole chain is working
      if (user?.accessToken) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.accessToken = user.accessToken;
        return token;
      }

      // For OAuth: keep account's access_token if available
      if (account && profile && !token.accessToken) {
        try {
          const res = await fetch(
            `http://backend:8080/auth/oauth-login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: profile.email,
                username: profile.name,
                provider: account.provider,
                providerID: account.providerAccountId,
              }),
            }
          );
          const springUsr = await res.json();

          if (res.ok && springUsr.accessToken) {
            token.accessToken = springUsr.accessToken;
            token.id = springUsr.id;
            token.email = springUsr.email; // Spring JWT
            token.name = springUsr.username;
          }
        } catch (error) {
          console.error("OAuth → Spring exchange failed", error);
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },

    async redirect({ url, baseUrl }) {
      // If error is in URL, redirect to /home
      if (url.includes("error=OAuthCallback")) {
        return `http://localhost:3000/home`;
      }
      return baseUrl;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

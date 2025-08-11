import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id?: string | null;
      email?: string | null;
      name?: string | null;
      image?: string | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    email?: string | null;
    name?: string | null;
    accessToken?: string;
  }
}

interface User {
  id?: string;
  name: string | null;
  email: string | null;
  accessToken?: string;
}

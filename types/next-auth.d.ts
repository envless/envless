import NextAuth, { DefaultSession } from "next-auth";

interface UserType {
  id: string;
  name: string;
  email: string;
  twoFactorEnabled: boolean;
}

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: UserType;
  }
}

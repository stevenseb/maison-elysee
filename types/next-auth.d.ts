import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's ID. */
      id: string;
      /** The user's JWT token */
      token: string;
    } & DefaultSession['user']
  }

  interface User extends DefaultUser {
    id: string;
    token: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    /** The user's ID. */
    id: string;
    /** The user's JWT token */
    token: string;
  }
}

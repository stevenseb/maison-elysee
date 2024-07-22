import NextAuth, { AuthOptions, Session, User as NextAuthUser } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'your_jwt_secret';

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        usernameOrEmail: { label: 'Username or Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }

        await dbConnect();

        const user = await User.findOne({
          $or: [{ username: credentials.usernameOrEmail }, { email: credentials.usernameOrEmail }],
        });

        if (user && bcrypt.compareSync(credentials.password, user.hashedPassword)) {
          const token = jwt.sign(
            { userId: user._id.toString(), username: user.username },
            JWT_SECRET,
            { expiresIn: '1h' }
          );
          return { id: user._id.toString(), name: user.username, token };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
  },
  jwt: {
    secret: JWT_SECRET,
  },
  callbacks: {
    async session({ session, token }: { session: Session, token: any }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.token = token.token as string;
      }
      return session;
    },
    async jwt({ token, user }: { token: any, user?: NextAuthUser }) {
      if (user) {
        token.id = user.id;
        token.token = user.token;
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

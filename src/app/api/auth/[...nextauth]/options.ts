import { addUser, loginWithEmail } from '@/service/user';
import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcrypt';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_OAUTH_ID || '',
      clientSecret: process.env.GOOGLE_OAUTH_SECRET || '',
    }),
    CredentialsProvider({
      name: 'email',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const res = await loginWithEmail(credentials.email);

        if (!res) {
          throw new Error('일치하는 회원이 없습니다.');
        }

        const checkPassword = await compare(credentials.password, res.password);
        if (!checkPassword || res.email !== credentials.email) {
          throw new Error('이메일 혹은 패스워드가 일치하지 않습니다.');
        }

        return res;
      },
    }),
  ],
  callbacks: {
    async signIn({ user: { id, name, image, email } }) {
      if (!email) return false;
      addUser({
        id,
        name: name || '',
        email,
        image,
        username: email.split('@')[0] || '',
      });
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.name = user?.name ?? '';
        token.username = user?.username ?? '';
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      const user = session?.user;

      if (user) {
        session.user = {
          ...user,
          name: token.name || user.name,
          username: token.username || user.email?.split('@')[0],
          id: token.id as string,
        };
      }

      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
};

import NextAuth, { type NextAuthConfig } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcrypt';
import { addUser, loginWithEmail } from '@/service/user';
import { env } from '@/lib/env';

export const authConfig: NextAuthConfig = {
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_OAUTH_ID,
      clientSecret: env.GOOGLE_OAUTH_SECRET,
    }),
    CredentialsProvider({
      name: 'email',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const res = await loginWithEmail(credentials.email as string);

        if (!res) {
          throw new Error('일치하는 회원이 없습니다.');
        }

        const checkPassword = await compare(
          credentials.password as string,
          res.password
        );
        if (!checkPassword || res.email !== credentials.email) {
          throw new Error('이메일 혹은 패스워드가 일치하지 않습니다.');
        }

        return res;
      },
    }),
  ],
  callbacks: {
    async signIn({ user: { id, name, image, email }, account }) {
      if (!email || !id) return false;
      if (account?.provider === 'google') {
        try {
          await addUser({
            id: `google.${account?.providerAccountId}`,
            name: name || '',
            email,
            image,
            username: email.split('@')[0] || '',
          });
        } catch (error) {
          console.error(error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.name = user?.name ?? '';
        token.username = (user as { username?: string }).username ?? '';
        token.id =
          account?.provider === 'google'
            ? `google.${account.providerAccountId}`
            : user.id;
      }
      return token;
    },
    async session({ session, token }) {
      const user = session?.user;

      if (user) {
        session.user = {
          ...user,
          name: token.name || user.name,
          username: (token.username as string) || user.email?.split('@')[0],
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

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

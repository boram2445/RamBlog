import { AuthUser } from '@/model/user';

declare module 'next-auth' {
  interface Session {
    user: AuthUser;
  }

  interface User extends DefaultUser {
    username: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    username?: string;
  }
}

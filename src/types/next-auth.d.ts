import { AuthUser } from '@/model/user';

declare module 'next-auth' {
  interface Session {
    user: AuthUser;
  }
}

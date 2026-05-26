import { auth } from '@/auth';
import { AuthUser } from '@/model/user';

export async function withSessionUser(
  handler: (user: AuthUser) => Promise<Response>
): Promise<Response> {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return new Response('Authentication Error', { status: 401 });
  }

  return handler(user);
}

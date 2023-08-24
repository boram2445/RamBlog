import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import WritePostForm from '@/components/post/WritePostForm';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function NewPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    redirect('/auth/signin');
  }

  return (
    <>
      <WritePostForm username={user.username} />
    </>
  );
}

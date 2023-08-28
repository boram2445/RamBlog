import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../api/auth/[...nextauth]/options';
import WritePostForm from '@/components/post/WritePostForm';

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

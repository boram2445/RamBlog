import type { Metadata } from 'next';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import WritePostForm from '@/components/post/WritePostForm';

export const metadata: Metadata = {
  title: 'Write Post | RamBlog',
  description: '포스트 작성',
};

export const dynamic = 'force-dynamic';

export default async function NewPage() {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    redirect('/auth/signin');
  }

  return (
    <>
      <WritePostForm slug={user.slug} />
    </>
  );
}

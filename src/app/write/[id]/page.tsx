import type { Metadata } from 'next';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import WritePostForm from '@/components/post/WritePostForm';
import { getPostDetail } from '@/service/posts';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Edit Post | RamBlog',
  description: '포스트 수정',
};

type Props = {
  params: {
    id: string;
  };
};

export const dynamic = 'force-dynamic';

export default async function EditPage({ params: { id } }: Props) {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    redirect('/auth/signin');
  }

  const postDetail = (await getPostDetail(id, user.username))?.currentPost;

  return (
    <>
      <WritePostForm id={id} postDetail={postDetail} username={user.username} />
    </>
  );
}

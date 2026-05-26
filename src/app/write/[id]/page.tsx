import type { Metadata } from 'next';
import { auth } from '@/auth';
import WritePostForm from '@/components/post/WritePostForm';
import { getPostDetail } from '@/service/posts';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Edit Post | RamBlog',
  description: '포스트 수정',
};

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export const dynamic = 'force-dynamic';

export default async function EditPage(props: Props) {
  const params = await props.params;

  const {
    id
  } = params;

  const session = await auth();
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

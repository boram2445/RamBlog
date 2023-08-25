import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import PostDetail from '@/components/post/PostDetail';
import { getPostDetail } from '@/service/posts';
import { getServerSession } from 'next-auth';
import { cache } from 'react';

type Props = {
  params: {
    user: string;
    id: string;
  };
};

const getDetail = cache(getPostDetail);

export default async function PostPage({ params: { user, id } }: Props) {
  const session = await getServerSession(authOptions);
  const loginUserData = session?.user;

  const post = await getDetail(id, user);

  return (
    <>
      <PostDetail post={post} loginUserData={loginUserData} />
    </>
  );
}

export async function generateMetadata({ params: { user, id } }: Props) {
  const { title, description } = await getDetail(id, user);
  return { title, description };
}

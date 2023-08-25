import PostDetail from '@/components/post/PostDetail';
import { getPostDetail } from '@/service/posts';
import { cache } from 'react';

type Props = {
  params: {
    user: string;
    id: string;
  };
};

const getDetail = cache(getPostDetail);

export default async function PostPage({ params: { user, id } }: Props) {
  const post = await getDetail(id, user);

  return (
    <>
      <PostDetail post={post} username={user} />
    </>
  );
}

export async function generateMetadata({ params: { user, id } }: Props) {
  const { title, description } = await getDetail(id, user);
  return { title, description };
}

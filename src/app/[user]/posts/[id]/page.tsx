import PostDetail from '@/components/post/PostDetail';
import { getPostDetail } from '@/service/posts';
import { cache } from 'react';

type Props = {
  params: {
    user: string;
    id: string;
  };
};

const getDetail = cache(async (user: string, postId: string) =>
  getPostDetail(user, postId)
);

export default async function PostPage({ params: { user, id } }: Props) {
  const post = await getDetail(user, id);

  return (
    <>
      <PostDetail post={post} />
    </>
  );
}

export async function generateMetadata({ params: { user, id } }: Props) {
  const { title, description } = await getDetail(user, id);
  return { title, description };
}

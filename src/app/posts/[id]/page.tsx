import PostDetail from '@/components/post/PostDetail';
import { getPostDetail } from '@/service/posts';
import { cache } from 'react';

type Props = {
  params: {
    id: string;
  };
};

const getDetail = cache(async (postId: string) => getPostDetail(postId));

export default async function PostPage({ params: { id } }: Props) {
  const post = await getDetail(id);

  return (
    <>
      <PostDetail post={post} />
    </>
  );
}

export async function generateMetadata({ params: { id } }: Props) {
  const { title, description } = await getDetail(id);
  return { title, description };
}

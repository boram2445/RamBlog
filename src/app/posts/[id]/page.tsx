import PostDetail from '@/components/post/PostDetail';
import { getPostDetail } from '@/service/posts';

type Props = {
  params: {
    id: string;
  };
};

export default async function PostPage({ params: { id } }: Props) {
  const post = await getPostDetail(id);

  return (
    <>
      <PostDetail post={post} />
    </>
  );
}

export async function generateMetadata({ params: { id } }: Props) {
  const { title, description } = await getPostDetail(id);
  return { title, description };
}

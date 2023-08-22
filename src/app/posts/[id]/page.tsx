import AdjacentPostCard from '@/components/post/AdjacentPostCard';
import MarkDownPost from '@/components/post/MarkDownPost';
import PostDetail from '@/components/post/PostDetail';
import { getPostDetail } from '@/service/posts';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
  params: {
    id: string;
  };
};

export default function PostPage({ params: { id } }: Props) {
  return (
    <>
      <PostDetail id={id} />
    </>
  );
}

export async function generateMetadata({ params: { id } }: Props) {
  const { title, description } = await getPostDetail(id);
  return { title, description };
}

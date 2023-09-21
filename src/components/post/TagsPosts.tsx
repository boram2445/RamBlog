'use client';

import useFullPost from '@/hooks/useFullPost';
import PostGrid, { PostGridLoading } from '../common/PostGrid';

type Props = {
  tag: string;
};

export default function TagPosts({ tag }: Props) {
  const { posts, isLoading, error } = useFullPost(tag);

  return (
    <>
      {isLoading && <PostGridLoading />}
      {!isLoading && !error && posts && <PostGrid posts={posts} />}
    </>
  );
}

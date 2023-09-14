'use client';

import useFullPost from '@/hooks/useFullPost';
import PostGrid, { PostGridLoading } from '../common/PostGrid';

export default function FullPosts() {
  const { posts, isLoading, error } = useFullPost();

  return (
    <>
      {isLoading && <PostGridLoading />}
      {!isLoading && !error && <PostGrid posts={posts ?? []} />}
    </>
  );
}

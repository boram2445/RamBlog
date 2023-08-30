'use client';

import useFullPost from '@/hooks/useFullPost';
import PostGrid from '../common/PostGrid';
import { ClipLoader } from 'react-spinners';

export default function FullPosts() {
  const { posts, isLoading, error } = useFullPost();

  return (
    <>
      {isLoading && <ClipLoader />}
      {!isLoading && !error && <PostGrid posts={posts ?? []} />}
    </>
  );
}

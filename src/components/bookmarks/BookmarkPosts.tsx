'use client';

import useSWR from 'swr';
import { SimplePost } from '@/model/post';
import PostGrid, { PostGridLoading } from '../common/PostGrid';
import NoContent from '../ui/NoContent';

export default function BookmarkPosts() {
  const {
    data: posts,
    isLoading,
    error,
  } = useSWR<SimplePost[]>(`/api/bookmarks`);

  return (
    <>
      {isLoading && <PostGridLoading />}
      {posts && posts.length > 0 && <PostGrid posts={posts} />}
      {posts && posts.length === 0 && (
        <NoContent text='북마크한 포스트가 없어요😥' />
      )}
    </>
  );
}

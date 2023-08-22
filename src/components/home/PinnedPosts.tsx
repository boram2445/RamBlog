'use client';

import PostCard from '../ui/PostCard';
import usePosts from '@/hooks/usePosts';

export default function PinnedPosts() {
  const { posts, isLoading, error } = usePosts();
  const pinnedPosts = posts?.filter((post) => post.pinned === true);

  return (
    <ul className='mx-auto grid grid-cols-1 tablet:grid-cols-2  laptop:grid-cols-3 gap-6'>
      {pinnedPosts?.map((post, index) => (
        <li key={index}>
          <PostCard post={post} />
        </li>
      ))}
    </ul>
  );
}

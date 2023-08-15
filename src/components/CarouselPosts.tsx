'use client';

import MultiCarousel from './MultiCarousel';
import PostCard from './PostCard';
import usePosts from '@/hooks/usePosts';

export default function CarouselPosts() {
  const { posts, isLoading, error } = usePosts();
  const unpinnedPosts = posts?.filter((post) => post.pinned === false);

  if (!unpinnedPosts) return null;
  return (
    <MultiCarousel>
      {unpinnedPosts.map((post, index) => (
        <PostCard key={index} post={post} />
      ))}
    </MultiCarousel>
  );
}

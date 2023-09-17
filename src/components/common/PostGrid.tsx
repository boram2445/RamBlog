'use client';

import { Post } from '@/model/post';
import PostCard, { PostCardLoading } from '../post/PostCard';

type Props = {
  posts: Post[];
};

export default function PostGrid({ posts }: Props) {
  return (
    <ul className='mx-auto grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 desktop:grid-cols-4 gap-6'>
      {posts?.map((post, index) => (
        <li key={index}>
          <PostCard post={post} />
        </li>
      ))}
    </ul>
  );
}

export function PostGridLoading() {
  return (
    <ul className='mx-auto grid grid-cols-1 tablet:grid-cols-2  laptop:grid-cols-3 gap-6'>
      {Array.from({ length: 6 }, (_, index) => (
        <PostCardLoading key={index} />
      ))}
    </ul>
  );
}

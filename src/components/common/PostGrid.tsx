'use client';

import { Post } from '@/model/post';
import PostCard from '../post/PostCard';

type Props = {
  posts: Post[];
};

export default function PostGrid({ posts }: Props) {
  return (
    <ul className='mx-auto grid grid-cols-1 tablet:grid-cols-2  laptop:grid-cols-3 gap-6'>
      {posts?.map((post, index) => (
        <li key={index}>
          <PostCard post={post} />
        </li>
      ))}
    </ul>
  );
}

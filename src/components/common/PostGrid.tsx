'use client';

import { SimplePost } from '@/model/post';
import PostCard, { PostCardLoading } from '../post/PostCard';

type Props = {
  posts: SimplePost[];
};

const gridStyle =
  'mx-auto grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 desktop:grid-cols-4 gap-6';

export default function PostGrid({ posts }: Props) {
  return (
    <ul className={gridStyle}>
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
    <ul className={gridStyle}>
      {Array.from({ length: 6 }, (_, index) => (
        <PostCardLoading key={index} />
      ))}
    </ul>
  );
}

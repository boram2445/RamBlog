'use client';

import useUserPost from '@/hooks/useUserPost';
import { HomeUser } from '@/model/user';
import { PulseLoader } from 'react-spinners';
import PostListCard from '../post/PostListCard';

type Props = {
  user: HomeUser;
};

export default function PostList({ user }: Props) {
  const { posts, isLoading, error } = useUserPost(user.username);

  console.log(posts);
  return (
    <>
      {isLoading && <PulseLoader />}
      {!isLoading && !error && (
        <ul className='mx-6 flex flex-col gap-4'>
          {posts?.map((post) => (
            <li key={post.id}>
              <PostListCard post={post} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

'use client';

import useUserPost from '@/hooks/useUserPost';
import { HomeUser } from '@/model/user';
import { ClipLoader } from 'react-spinners';
import PostListCard from '../post/PostListCard';

type Props = {
  user: HomeUser;
};

export default function PostList({ user }: Props) {
  const { posts, isLoading, error } = useUserPost(user.username);

  return (
    <>
      {isLoading && (
        <div className='text-center'>
          <ClipLoader color='gray' />
        </div>
      )}
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

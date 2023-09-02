'use client';

import useUserPost from '@/hooks/useUserPost';
import { HomeUser } from '@/model/user';
import { PulseLoader } from 'react-spinners';

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
        <ul>
          {posts?.map((post) => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      )}
    </>
  );
}

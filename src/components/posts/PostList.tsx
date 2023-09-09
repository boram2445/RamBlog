'use client';

import useUserPost from '@/hooks/useUserPost';
import { HomeUser } from '@/model/user';
import { ClipLoader } from 'react-spinners';
import PostListCard from '../post/PostListCard';
import UserTagList from '../user/UserTagList';
import { useState } from 'react';
import Title from '../ui/Title';

type Props = {
  user: HomeUser;
};

export default function PostList({ user }: Props) {
  const [selectedTag, setSelectedTag] = useState('all');
  const { posts, isLoading, error } = useUserPost(user.username, selectedTag);

  return (
    <>
      <div className='mb-12'>
        <Title
          title='Posts'
          description='기술, 레슨, 오래 기억하고 싶은 것들을 작성합니다'
        />
      </div>
      <UserTagList
        username={user.username}
        onClick={setSelectedTag}
        selected={selectedTag}
      />
      {isLoading && (
        <div className='text-center'>
          <ClipLoader color='gray' />
        </div>
      )}
      {!isLoading && !error && (
        <ul className='flex flex-col gap-4'>
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

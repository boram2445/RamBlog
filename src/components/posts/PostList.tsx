'use client';

import useUserPost from '@/hooks/useUserPost';
import { ProfileUser } from '@/model/user';
import PostListCard, { PostListCardLoading } from '../post/PostListCard';
import UserTagList from '../user/UserTagList';
import { useState } from 'react';
import Title from '../ui/Title';

type Props = {
  user: ProfileUser;
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
      {isLoading && <PostListLoading />}
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

export function PostListLoading() {
  return (
    <ul>
      {Array.from({ length: 2 }, (_, index) => (
        <PostListCardLoading key={index} />
      ))}
    </ul>
  );
}

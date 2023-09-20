'use client';

import { Post } from '@/model/post';
import { FormEvent, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import useSWR from 'swr';
import PostGrid from '../common/PostGrid';
import { BsSearch } from 'react-icons/bs';
import { AiFillCloseCircle } from 'react-icons/ai';
import useDebounce from '@/hooks/useDebounce';

type Props = {
  username?: string;
};

export default function SearchList({ username }: Props) {
  const [keyword, setKeyword] = useState('');
  const debouncedKeyword = useDebounce(keyword);
  const url = !username
    ? `/api/search/${debouncedKeyword}`
    : `/api/${username}/search/${debouncedKeyword}`;
  const {
    data: posts,
    isLoading,
    error,
  } = useSWR<Post[]>(debouncedKeyword ? url : null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  const deleteKeyword = () => setKeyword('');

  return (
    <section className='mx-auto px-5'>
      <form onSubmit={handleSubmit} className='my-8 flex flex-col items-center'>
        {username && (
          <p className='text-gray-600 text-sm'>
            {username}님의 포스트를 검색해보세요✨
          </p>
        )}
        <div className='relative shadow-md w-5/6 tablet:w-3/4 laptop:w-1/2 rounded-xl'>
          <input
            type='text'
            placeholder='검색어를 입력하세요'
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className='pl-14 pr-5 py-4 w-full rounded-xl'
            autoFocus
          />
          <BsSearch className='w-5 h-5 absolute top-1/2 left-6 -translate-y-1/2 text-gray-400 outline-indigo-300' />
          {keyword && (
            <button
              type='button'
              className='absolute  top-1/2 right-6 -translate-y-1/2'
              onClick={deleteKeyword}
            >
              <AiFillCloseCircle className='text-gray-300 w-5 h-5' />
            </button>
          )}
        </div>
      </form>
      {error && <p>{error}</p>}
      {isLoading && (
        <div className='text-center'>
          <ClipLoader className='text-gray-400' />
        </div>
      )}
      {!isLoading && !error && posts?.length === 0 && (
        <p className='text-center'>찾는 포스트가 없습니다🙄</p>
      )}
      {posts && <PostGrid posts={posts} />}
    </section>
  );
}

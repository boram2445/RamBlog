'use client';

import Avartar from '../ui/Avartar';
import { useRouter } from 'next/navigation';
import { BsPlusSquare } from 'react-icons/bs';
import { AiOutlineMinusSquare } from 'react-icons/ai';
import { useState } from 'react';
import CommentForm from './CommentForm';
import { Comment } from '@/service/comment';

type Props = {
  comment: Comment;
};

export default function Comment({ comment }: Props) {
  const {
    image,
    username,
    comment: text,
    createdAt,
    type,
    recomments,
    id,
  } = comment;
  const router = useRouter();

  const [openForm, setOpenForm] = useState(false);

  return (
    <div className=' p-4 bg-gray-50 rounded-lg'>
      <div className='mb-2 flex items-center gap-4'>
        <Avartar imageUrl={image} username={username} type='big' />
        <div className='flex flex-col gap-1'>
          <span
            className={`text-semibold ${
              type === 'loggedInUserComment' && 'hover:underline cursor-pointer'
            }`}
            onClick={() => router.push(`/${username}`)}
          >
            {username}
          </span>
          <time className='text-sm text-gray-400'>{createdAt.toString()}</time>
        </div>
      </div>
      <p className='ml-2 pt-3 pb-5'>{text}</p>

      <button
        className='ml-2 flex items-center gap-2 hover:text-gray-700'
        onClick={() => setOpenForm((prev) => !prev)}
      >
        {!openForm && (
          <>
            <BsPlusSquare size='14' />
            <span className='text-sm'>
              {recomments ? `${recomments}개의 답글` : '답글 달기'}
            </span>
          </>
        )}
        {openForm && (
          <>
            <AiOutlineMinusSquare />
            <span className='text-sm'>숨기기</span>
          </>
        )}
      </button>
      {openForm && (
        <div className='mt-4'>
          <CommentForm />
        </div>
      )}
    </div>
  );
}

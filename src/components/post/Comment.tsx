'use client';

import Avartar from '../ui/Avartar';
import { useRouter } from 'next/navigation';
import { BsPlusSquare } from 'react-icons/bs';
import { AiOutlineMinusSquare } from 'react-icons/ai';
import { useState } from 'react';
import CommentForm from './CommentForm';
import { Comment } from '@/service/comment';
import CommentList from './CommentList';
import ReCommentList from './RecommentList';

type Props = {
  comment: Comment;
  commentType?: 'comment' | 'recomment';
};

export default function Comment({ comment, commentType = 'comment' }: Props) {
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
    <div
      className={`p-4 rounded-lg ${
        commentType === 'comment' ? 'bg-gray-50' : 'bg-gray-100'
      }`}
    >
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
          <time className='text-sm text-gray-400'>{createdAt?.toString()}</time>
        </div>
      </div>
      <p className='ml-2 pt-3 pb-5'>{text}</p>
      <button
        className='ml-2 flex items-center gap-2 hover:text-gray-700'
        onClick={() => setOpenForm((prev) => !prev)}
      >
        {commentType === 'comment' && !openForm && (
          <>
            <BsPlusSquare size='14' />
            <span className='text-sm'>
              {recomments ? `${recomments.length}개의 답글` : '답글 달기'}
            </span>
          </>
        )}
        {commentType === 'comment' && openForm && (
          <>
            <AiOutlineMinusSquare />
            <span className='text-sm'>숨기기</span>
          </>
        )}
      </button>
      {openForm && <ReCommentList comments={comment.recomments} />}
    </div>
  );
}

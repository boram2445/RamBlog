'use client';

import Avartar from '../ui/Avartar';
import { useRouter } from 'next/navigation';
import { BsPlusSquare } from 'react-icons/bs';
import { AiOutlineMinusSquare } from 'react-icons/ai';
import { useState } from 'react';
import { Comment } from '@/service/comment';
import ReCommentList from './RecommentList';
import { AuthUser } from '@/model/user';
import PasswordForm from './PasswordForm';
import useComment from '@/hooks/useComment';
import Date from '../ui/Date';

type Props = {
  postId: string;
  postUser: string;
  comment: Comment;
  commentType?: 'comment' | 'recomment';
  loginUserData?: AuthUser;
  parentCommentId?: string;
};

export default function Comment({
  postId,
  postUser,
  comment,
  commentType = 'comment',
  loginUserData,
  parentCommentId,
}: Props) {
  const router = useRouter();

  const { deleteComment } = useComment(postId);
  const [openForm, setOpenForm] = useState(false);
  const [openDeletePasswordForm, setOpenDeletePasswordForm] = useState(false);
  const {
    image,
    username,
    comment: text,
    createdAt,
    type,
    recomments,
    id,
    deleted,
  } = comment;

  console.log(deleted);
  const handleDeleteUserComment = () => {
    if (confirm('정말 댓글을 삭제하시겠습니까?😥')) {
      deleteComment(id, parentCommentId);
    }
  };

  const isUserDelete =
    loginUserData?.username === postUser ||
    loginUserData?.username === username;

  return (
    <div
      className={`relative p-4 rounded-lg ${
        commentType === 'comment' ? 'bg-gray-50' : 'bg-gray-100'
      }`}
    >
      {!deleted && (
        <div className='flex justify-between'>
          <div className='mb-2 flex items-center gap-4'>
            <Avartar imageUrl={image} username={username} type='big' />
            <div className='flex flex-col gap-1'>
              <span
                className={`text-semibold ${
                  type === 'loggedInUserComment' &&
                  'hover:underline cursor-pointer'
                }`}
                onClick={() => router.push(`/${username}`)}
              >
                {username}
              </span>
              <Date date={createdAt?.toString()} dateType='date' />
            </div>
          </div>
          {(isUserDelete || type === 'guestComment') && (
            <button
              onClick={
                type === 'guestComment'
                  ? () => setOpenDeletePasswordForm(true)
                  : handleDeleteUserComment
              }
              className='hover:underline self-start mr-2'
            >
              삭제
            </button>
          )}
        </div>
      )}

      <p className='ml-2 pt-3 pb-5'>{text}</p>

      <button
        className='ml-2 flex items-center gap-2 hover:text-gray-700'
        onClick={() => setOpenForm((prev) => !prev)}
      >
        {commentType === 'comment' && !openForm && (
          <>
            <BsPlusSquare size='14' />
            <span className='text-sm'>
              {recomments?.length
                ? `${recomments?.length}개의 답글`
                : '답글 달기'}
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

      {openForm && (
        <ReCommentList
          comments={comment.recomments}
          postId={postId}
          postUser={postUser}
          commentId={id}
          loginUserData={loginUserData}
        />
      )}
      {openDeletePasswordForm && (
        <PasswordForm
          parentCommentId={parentCommentId}
          setForm={setOpenDeletePasswordForm}
          postId={postId}
          commentId={id}
        />
      )}
    </div>
  );
}

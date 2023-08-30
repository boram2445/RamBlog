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
import axios from 'axios';

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

  const [openDeletePasswordForm, setOpenDeletePasswordForm] = useState(false);

  const handleDeleteUserComment = () => {
    if (confirm('정말 댓글을 삭제하시겠습니까?😥')) {
      axios
        .delete(
          `/api/comment/${postId}?commentId=${id}&parentCommentId=${parentCommentId}`
        )
        .then(() => console.log('삭제가 완료되었습니다.'))
        .catch((err) => console.log(err));
    }
  };

  return (
    <div
      className={`relative p-4 rounded-lg ${
        commentType === 'comment' ? 'bg-gray-50' : 'bg-gray-100'
      }`}
    >
      <div>
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
            <time className='text-sm text-gray-400'>
              {createdAt?.toString()}
            </time>
          </div>
        </div>
        {/* 포스트 주인은 그냥 삭제 가능 */}
        {postUser === username && (
          <button onClick={handleDeleteUserComment} className='hover:underline'>
            삭제
          </button>
        )}
        {/* 다른 포스트에서 내가 작성한 글일 경우 */}
        {loginUserData?.username === username && (
          <button onClick={handleDeleteUserComment} className='hover:underline'>
            삭제
          </button>
        )}
        {/* guest일 경우 비밀번호 입력 후 제거 가능 */}
        {type === 'guestComment' && (
          <button
            onClick={() => setOpenDeletePasswordForm(true)}
            className='hover:underline'
          >
            삭제
          </button>
        )}
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

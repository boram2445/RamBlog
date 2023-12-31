'use client';

import { useState } from 'react';
import { Comment as CommentType } from '@/model/comment';
import Comment from './Comment';
import CommentForm from './CommentForm';
import Button from '../ui/Button';
import { AuthUser } from '@/model/user';

type Props = {
  comments?: CommentType[];
  postId: string;
  postUser: string;
  commentId: string;
  loginUserData?: AuthUser;
};

export default function ReCommentList({
  comments,
  postId,
  postUser,
  commentId,
  loginUserData,
}: Props) {
  const [openForm, setOpenForm] = useState(false);

  return (
    <div className='mt-3 my-6 ml-2'>
      {comments && (
        <ul className='mb-4 flex flex-col gap-3'>
          {comments.map((comment) => (
            <li key={comment.id}>
              <Comment
                postId={postId}
                postUser={postUser}
                comment={comment}
                commentType='recomment'
                loginUserData={loginUserData}
                parentCommentId={commentId}
              />
            </li>
          ))}
        </ul>
      )}
      {comments && comments.length > 0 && !openForm && (
        <Button onClick={() => setOpenForm((prev) => !prev)} size='max'>
          답글 달기
        </Button>
      )}
      {(!comments || comments.length === 0 || openForm) && (
        <CommentForm postId={postId} commentId={commentId} />
      )}
    </div>
  );
}

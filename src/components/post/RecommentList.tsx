'use client';

import { useState } from 'react';
import { Comment as CommentType } from '@/service/comment';
import Comment from './Comment';
import CommentForm from './CommentForm';
import Button from '../ui/Button';

type Props = {
  comments?: CommentType[];
  postId: string;
  commentId: string;
};

export default function ReCommentList({ comments, postId, commentId }: Props) {
  const [openForm, setOpenForm] = useState(false);

  return (
    <div className='mt-4 my-12 ml-2'>
      {comments && (
        <ul className='mb-4 flex flex-col gap-3'>
          {comments.map((comment) => (
            <li key={comment.id}>
              <Comment
                postId={postId}
                comment={comment}
                commentType='recomment'
              />
            </li>
          ))}
        </ul>
      )}
      {comments && !openForm && (
        <Button onClick={() => setOpenForm((prev) => !prev)} type='max'>
          답글 달기
        </Button>
      )}
      {(openForm || !comments) && (
        <CommentForm postId={postId} commentId={commentId} />
      )}
    </div>
  );
}

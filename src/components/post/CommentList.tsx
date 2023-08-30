'use client';

import useSWR from 'swr';
import { Comment as CommetType } from '@/service/comment';
import CommentForm from './CommentForm';
import Comment from './Comment';
import { ClipLoader } from 'react-spinners';
import { AuthUser } from '@/model/user';

type Props = {
  postId: string;
  postUser: string;
  loginUserData?: AuthUser;
};

export default function CommentList({
  postId,
  postUser,
  loginUserData,
}: Props) {
  const { data: comments, isLoading } = useSWR<CommetType[]>(
    `/api/comment/${postId}`
  );

  return (
    <>
      <h4 className='border-b border-gray-200 pb-1 mb-5 text-sm text-gray-500 font-semibold'>
        댓글 <span className='text-red-500'>{comments?.length ?? 0}</span>
      </h4>
      <div className='w-full px-4 tablet:px-8 laptop:px-16 desktop:px-20'>
        <CommentForm postId={postId} />
        {isLoading && <ClipLoader />}
        {comments && (
          <ul className='mt-12 flex flex-col gap-3'>
            {comments.map((comment) => (
              <li key={comment.id}>
                <Comment
                  comment={comment}
                  postId={postId}
                  postUser={postUser}
                  loginUserData={loginUserData}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

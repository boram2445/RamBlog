'use client';

import CommentForm from './CommentForm';
import Comment from './Comment';
import { ClipLoader } from 'react-spinners';
import { AuthUser } from '@/model/user';
import useComment from '@/hooks/useComment';

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
  const { comments, isLoading } = useComment(postId);

  return (
    <>
      <h3 className='border-b border-gray-200 pb-1 mb-5 text-gray-500 font-semibold dark:text-slate-400 dark:border-neutral-700'>
        댓글 <span className='text-red-500'>{comments?.length ?? 0}</span>
      </h3>
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

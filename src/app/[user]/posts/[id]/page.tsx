import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import CommentForm from '@/components/post/CommentForm';
import CommentList from '@/components/post/CommentList';
import PostDetail from '@/components/post/PostDetail';
import { getPostDetail } from '@/service/posts';
import { getServerSession } from 'next-auth';
import { cache } from 'react';

type Props = {
  params: {
    user: string;
    id: string;
  };
};

const getDetail = cache(getPostDetail);

export default async function PostPage({ params: { user, id } }: Props) {
  const session = await getServerSession(authOptions);
  const loginUserData = session?.user;

  const post = await getDetail(id, user);

  return (
    <div className='max-w-screen-lg mx-auto p-8'>
      <PostDetail post={post} loginUserData={loginUserData} />
      <h4 className='border-b border-gray-200 pb-1 mb-5 text-sm text-gray-500 font-semibold'>
        댓글 <span className='text-red-500'>{post.comments?.length ?? 0}</span>
      </h4>
      <div className='w-full px-4 tablet:px-8 laptop:px-16 desktop:px-20'>
        <CommentForm />
        {post.comments?.length && <CommentList comments={post.comments} />}
      </div>
    </div>
  );
}

export async function generateMetadata({ params: { user, id } }: Props) {
  const { title, description } = await getDetail(id, user);
  return { title, description };
}

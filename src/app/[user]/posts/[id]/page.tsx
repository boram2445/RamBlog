import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import CommentList from '@/components/comment/CommentList';
import PostDetail, { PostDetailLoading } from '@/components/post/PostDetail';
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
    <div className='mx-auto max-w-3xl laptop:max-w-6xl pb-20 '>
      <PostDetail
        currentPost={post.currentPost}
        nextPost={post.nextPost}
        previousPost={post.previousPost}
        loginUserData={loginUserData}
      />
      <CommentList
        postId={post.currentPost.id}
        postUser={post.currentPost.username}
        loginUserData={loginUserData}
      />
    </div>
  );
}

export async function generateMetadata({ params: { user, id } }: Props) {
  const { title, description } = (await getDetail(id, user))?.currentPost;
  return { title, description };
}

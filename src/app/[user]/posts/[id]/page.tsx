import { auth } from '@/auth';
import CommentList from '@/components/comment/CommentList';
import PostDetail from '@/components/post/PostDetail';
import { getPostDetail } from '@/service/posts';
import { cache } from 'react';

type Props = {
  params: Promise<{
    user: string;
    id: string;
  }>;
};

const getDetail = cache(getPostDetail);

export default async function PostPage(props: Props) {
  const params = await props.params;

  const {
    user,
    id
  } = params;

  const session = await auth();
  const loginUserData = session?.user;

  const post = await getDetail(id, user);

  return (
    <div className='mx-auto max-w-3xl laptop:max-w-6xl laptop:px-7 pb-20 '>
      <PostDetail
        postId={id}
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

export async function generateMetadata(props: Props) {
  const params = await props.params;

  const {
    user,
    id
  } = params;

  const { title, description } = (await getDetail(id, user))?.currentPost;
  return { title, description };
}

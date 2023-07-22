import PostCategory from '@/components/PostCategory';
import { getPosts } from '@/service/posts';

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <div className='mx-auto max-w-screen-lg mt-10 flex'>
      <PostCategory posts={posts} />
    </div>
  );
}

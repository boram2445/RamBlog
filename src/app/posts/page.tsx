import PostCategory from '@/components/PostCategory';
import { getAllPosts } from '@/service/posts';

export default async function PostsPage() {
  const posts = await getAllPosts();

  return (
    <div className='mx-auto max-w-screen-lg mt-10 flex'>
      <PostCategory posts={posts} />
    </div>
  );
}

import PostGrid from '@/components/common/PostGrid';
import { getAllPostsData } from '@/service/posts';

export default async function HomePage() {
  const posts = await getAllPostsData();

  return (
    <div className='max-w-screen-lg my-10 mx-auto p-5'>
      <PostGrid posts={posts} />
    </div>
  );
}

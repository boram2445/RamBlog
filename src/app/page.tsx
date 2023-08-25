import PostGrid from '@/components/ui/PostGrid';
import { getAllPostsData } from '@/service/posts';

export default async function HomePage() {
  const posts = await getAllPostsData();

  return (
    <>
      <PostGrid posts={posts} />
    </>
  );
}

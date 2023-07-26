import { getAllPosts } from '@/service/posts';
import FilterablePosts from '@/components/FilterablePosts';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog Posts',
  description: '프론트엔드 개발 관련 포스트',
};

export default async function PostsPage() {
  const posts = await getAllPosts();
  const categories = [...new Set(posts.map((post) => post.category))];

  return (
    <div className='mx-auto max-w-screen-lg mt-10 flex'>
      <FilterablePosts posts={posts} categories={categories} />
    </div>
  );
}

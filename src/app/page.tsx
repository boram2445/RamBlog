import Hero from '@/components/home/Hero';
import PostList from '@/components/home/PostList';

export default async function HomePage() {
  return (
    <>
      <Hero />
      <PostList />
    </>
  );
}

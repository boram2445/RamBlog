import FullPosts from '@/components/post/FullPosts';

export default async function HomePage() {
  return (
    <div className='mx-auto max-w-3xl laptop:max-w-7xl my-10'>
      <FullPosts />
    </div>
  );
}

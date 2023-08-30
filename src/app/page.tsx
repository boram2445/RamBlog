import FullPosts from '@/components/post/FullPosts';

export default async function HomePage() {
  return (
    <div className='max-w-screen-lg my-10 mx-auto p-5'>
      <FullPosts />
    </div>
  );
}

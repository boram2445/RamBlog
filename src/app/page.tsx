import FullPosts from '@/components/post/FullPosts';
import Title from '@/components/ui/Title';

export default async function HomePage() {
  return (
    <div className='p-5'>
      <div className='mb-12'>
        <Title title='All Posts' description='공유하고 싶은 지식을 나눕니다.' />
      </div>
      <FullPosts />
    </div>
  );
}

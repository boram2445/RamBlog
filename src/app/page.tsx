import Hero from '@/components/home/Hero';
import PinnedPosts from '@/components/home/PinnedPosts';
import CarouselPosts from '@/components/home/CarouselPosts';

const titleStyle = 'mx-auto pb-2 mb-5 text-xl font-semibold text-black';

export default async function HomePage() {
  return (
    <>
      <Hero />
      <div className='max-w-screen-lg my-10 mx-auto p-5'>
        <section>
          <h2 className={titleStyle}>추천 포스트</h2>
          <PinnedPosts />
        </section>
        <section className='mt-10'>
          <h2 className={titleStyle}>최근 포스트</h2>
          <CarouselPosts />
        </section>
      </div>
    </>
  );
}

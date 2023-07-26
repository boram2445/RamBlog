import Hero from '@/components/Hero';
import FeaturedPosts from '@/components/FeaturedPosts';
import CarouselPosts from '@/components/CarouselPosts';

export default async function Home() {
  return (
    <>
      <Hero />
      <div className='max-w-screen-lg my-10 mx-auto p-5'>
        <FeaturedPosts />
        <CarouselPosts />
      </div>
    </>
  );
}

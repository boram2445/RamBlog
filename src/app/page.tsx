import Hero from '@/components/Hero';
import PinnedPosts from '@/components/PinnedPosts';
import CarouselPosts from '@/components/CarouselPosts';

const titleStyle =
  'mx-auto pb-2 mb-5 text-xl font-semibold text-black after:content-[""] after:block after:w-20 after:bg-brown after:h-0.5 after:mt-2.5';

export default async function HomePage() {
  return (
    <>
      <Hero />
      <div className='max-w-screen-lg my-10 mx-auto p-5'>
        <section>
          <h2 className={titleStyle}>Pinned</h2>
          <PinnedPosts />
        </section>
        <section>
          <h2 className={titleStyle}>You May Like</h2>
          <CarouselPosts />
        </section>
      </div>
    </>
  );
}

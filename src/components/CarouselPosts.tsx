import { getAllPosts } from '@/service/posts';
import MultiCarousel from './MultiCarousel';
import PostCard from './PostCard';

export default async function CarouselPosts() {
  const posts = await getAllPosts();

  return (
    <section>
      <h2 className='mx-auto my-5 pb-2 text-xl font-semibold text-black after:content-[""] after:block after:w-20 after:bg-brown after:h-0.5 after:mt-2.5'>
        You May Like
      </h2>
      <MultiCarousel>
        {posts.map((post, index) => (
          <PostCard key={index} post={post} />
        ))}
      </MultiCarousel>
    </section>
  );
}

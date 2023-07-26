import { getFeaturedPosts } from '@/service/posts';
import PostCard from './PostCard';

export default async function FeaturedPosts() {
  const featuredPosts = await getFeaturedPosts();

  return (
    <section>
      <h2 className='mx-auto pb-2 mb-5 text-xl font-semibold text-black after:content-[""] after:block after:w-20 after:bg-brown after:h-0.5 after:mt-2.5'>
        Featured Articles
      </h2>
      <ul className='mx-auto w-4/5 tablet:w-full grid grid-cols-1 tablet:grid-cols-2  laptop:grid-cols-3 gap-6'>
        {featuredPosts.map((post, index) => (
          <PostCard key={index} post={post} />
        ))}
      </ul>
    </section>
  );
}

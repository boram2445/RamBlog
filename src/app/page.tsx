import PostCard from '@/components/PostCard';
import PostCarousel from '@/components/PostCarousel';
import Profile from '@/components/Profile';
import { getFeaturedPosts, getPosts } from '@/service/posts';

export default async function Home() {
  const posts = await getPosts();
  const featuredPosts = await getFeaturedPosts();

  return (
    <>
      <Profile />
      <section className='max-w-screen-lg my-10 mx-auto p-5'>
        <h2 className='mx-auto pb-2 mb-5 text-xl font-semibold text-black after:content-[""] after:block after:w-20 after:bg-brown after:h-0.5 after:mt-2.5'>
          Featured Articles
        </h2>
        <div className='mx-auto w-4/5 laptop:w-full grid grid-cols-1 tablet:grid-cols-2  laptop:grid-cols-3 gap-6'>
          {featuredPosts.map((post, index) => (
            <PostCard key={index} post={post} />
          ))}
        </div>
      </section>
      <section className='max-w-screen-lg mt-10 mx-auto p-5'>
        <h2 className='mx-auto pb-2 mb-5 text-xl font-semibold text-black after:content-[""] after:block after:w-20 after:bg-brown after:h-0.5 after:mt-2.5'>
          You May Like
        </h2>
        <PostCarousel>
          {posts.map((post, index) => (
            <PostCard key={index} post={post} />
          ))}
        </PostCarousel>
      </section>
    </>
  );
}

import PostCard from '@/components/PostCard';
import Profile from '@/components/Profile';
import { getFeaturedPosts } from '@/service/posts';

export default async function Home() {
  const featuredPosts = await getFeaturedPosts();

  return (
    <>
      <Profile />
      <section className='my-10 mx-auto p-5 max-w-screen-xl'>
        <h2 className='mx-auto pb-2 mb-5 text-xl font-semibold text-black after:content-[""] after:block after:w-20 after:bg-brown after:h-0.5 after:mt-2.5'>
          Featured Articles
        </h2>
        <div className='mx-auto w-4/5 laptop:w-full grid grid-cols-1 tablet:grid-cols-2  laptop:grid-cols-3 desktop:grid-cols-4 gap-6'>
          {featuredPosts.map((post, index) => (
            <PostCard key={index} post={post} />
          ))}
        </div>
      </section>
    </>
  );
}

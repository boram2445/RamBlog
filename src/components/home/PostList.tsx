import { getLatestData, getPinnedData } from '@/service/posts';
import CarouselPosts from './CarouselPosts';
import PostGrid from '../ui/PostGrid';

const titleStyle = 'mx-auto pb-2 mb-5 text-xl font-semibold text-black';

export default async function PostList() {
  const pinnedPosts = await getPinnedData();
  const latestPosts = await getLatestData();

  return (
    <>
      <div className='max-w-screen-lg my-10 mx-auto p-5'>
        <section>
          <h2 className={titleStyle}>추천 포스트</h2>
          <PostGrid posts={pinnedPosts} />
        </section>
        <section className='mt-10'>
          <h2 className={titleStyle}>최근 포스트</h2>
          <CarouselPosts posts={latestPosts} />
        </section>
      </div>
    </>
  );
}

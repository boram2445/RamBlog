import { getLatestData, getPinnedData } from '@/service/posts';
import CarouselPosts from './CarouselPosts';
import PostGrid from '../common/PostGrid';
import { HomeUser } from '@/model/user';

const titleStyle = 'mx-auto pb-2 mb-5 text-xl font-semibold text-black';

type Props = {
  user: HomeUser;
};

export default async function PostList({ user }: Props) {
  const pinnedPosts = await getPinnedData(user.username);
  const latestPosts = await getLatestData(user.username);

  return (
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
  );
}

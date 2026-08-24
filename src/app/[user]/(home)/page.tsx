import PostList from '@/components/post/PostList';
import SeriesSection from '@/components/series/SeriesSection';
import Pagination from '@/components/ui/Pagination';
import UserTagList from '@/components/user/UserTagList';
import { pageParamSchema } from '@/lib/validation';
import { getUserPostsPage } from '@/service/posts';
import { getUserSeries } from '@/service/series';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{
    user: string;
  }>;
  searchParams: Promise<{
    page?: string;
    tag?: string;
  }>;
};

export default async function UserPage(props: Props) {
  const [params, searchParams] = await Promise.all([
    props.params,
    props.searchParams,
  ]);

  const { user } = params;
  const page = pageParamSchema.parse(searchParams.page);
  const tag = searchParams.tag?.trim() || undefined;

  const [seriesList, { posts, total, totalAll, totalPages }] =
    await Promise.all([
      getUserSeries(user),
      getUserPostsPage(user, { page, tag }),
    ]);

  // 존재하지 않는 페이지는 404. total이 0이면 포스트가 없는 것뿐이므로 빈 상태로 둔다.
  if (total > 0 && page > totalPages) notFound();

  return (
    <>
      {seriesList.length > 0 && (
        <SeriesSection seriesList={seriesList} slug={user} />
      )}
      <h2 className="text-xl font-bold my-4 flex items-baseline gap-2">
        Posts
        <span className="text-sm font-normal text-gray-500 dark:text-slate-400">
          {totalAll}개
        </span>
      </h2>
      <UserTagList slug={user} selected={tag ?? 'all'} />
      <PostList posts={posts} />
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        basePath={`/${user}`}
        query={tag ? { tag } : undefined}
      />
    </>
  );
}

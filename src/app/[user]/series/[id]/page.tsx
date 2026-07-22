import PostListCard from '@/components/post/PostListCard';
import SeriesTitle from '@/components/series/SeriesTitle';
import { getSeriesDetail } from '@/service/series';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cache } from 'react';

type Props = {
  params: Promise<{ user: string; id: string }>;
  searchParams: Promise<{ sort?: string }>;
};

const getDetail = cache(getSeriesDetail);

export default async function SeriesPage(props: Props) {
  const { user, id } = await props.params;
  const { sort } = await props.searchParams;

  const series = await getDetail(id, user);

  if (!series || series.authorSlug !== user) notFound();

  const thumbnail = series.posts[0]?.mainImage ?? '';

  const isLatest = sort === 'latest';
  // 편 번호는 정렬과 무관하게 고정: 오래된 순(서비스가 준 순서) 기준으로 먼저 번호를 붙인 뒤 뒤집는다
  const numbered = series.posts.map((post, index) => ({
    post,
    number: index + 1,
  }));
  const orderedPosts = isLatest ? [...numbered].reverse() : numbered;

  return (
    <div className="mx-auto max-w-3xl laptop:max-w-7xl my-10">
      <SeriesTitle series={series} thumbnail={thumbnail} />
      <div className="flex justify-end gap-3 px-3 my-4 text-sm">
        <Link
          href={`/${user}/series/${id}?sort=oldest`}
          className={
            isLatest ? 'text-gray-400' : 'text-indigo-500 font-semibold'
          }
        >
          오래된 순
        </Link>
        <Link
          href={`/${user}/series/${id}?sort=latest`}
          className={
            isLatest ? 'text-indigo-500 font-semibold' : 'text-gray-400'
          }
        >
          최신 순
        </Link>
      </div>
      {orderedPosts.map(({ post, number }) => {
        return (
          <div key={post.id} className="relative">
            {/* <span className="absolute top-2 right-2">{number}</span> */}
            <PostListCard post={post} />
          </div>
        );
      })}
    </div>
  );
}

export async function generateMetadata(props: Props) {
  const params = await props.params;

  const { user, id } = params;

  const post = await getDetail(id, user);

  if (!post) notFound();

  const { seriesName, description } = post;

  return {
    title: seriesName,
    description,
    alternates: {
      canonical: `/${user}/series/${id}`,
    },
  };
}

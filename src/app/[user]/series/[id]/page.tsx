import PostListCard from '@/components/post/PostListCard';
import SeriesCard from '@/components/series/SeriesCard';
import { getSeriesDetail } from '@/service/series';
import { notFound } from 'next/navigation';
import { cache } from 'react';

type Props = {
  params: Promise<{ user: string; id: string }>;
};

const getDetail = cache(getSeriesDetail);

export default async function SeriesPage(props: Props) {
  const params = await props.params;

  const { user, id } = params;

  const series = await getDetail(id, user);

  if (!series || series.authorSlug !== user) notFound();

  return (
    <div>
      {series.posts.map((post, index) => {
        return (
          <div key={post.id} className="relative">
            <span className="absolute top-2 right-2">{index + 1}</span>
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

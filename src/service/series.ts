import { defineQuery } from 'groq';
import { client } from './sanity';
import { simplePostProjection, mapPosts } from './posts';
import { Post } from '@/model/post';

const getUserSeriesQuery = defineQuery(`
  *[_type == "series" && author->slug == $slug]{
    "id": _id,
    seriesName,
    description,
    "postCount": count(*[_type == "post" && series._ref == ^._id]),
    "thumbnail": *[_type == "post" && series._ref == ^._id] | order(coalesce(seriesOrder, 9999) asc, coalesce(publishedAt, _createdAt) asc)[0].mainImage
  }
`);

const getSeriesDetailQuery = defineQuery(`
  *[_type == "series" && _id == $id][0]{
    "id": _id,
    seriesName,
    description,
    "authorSlug": author->slug,
    "posts": *[_type == "post" && series._ref == ^._id] | order(coalesce(seriesOrder, 9999) asc, coalesce(publishedAt, _createdAt) asc){${simplePostProjection}}
  }
`);

export type SeriesDetail = {
  id: string;
  seriesName: string;
  description: string;
  authorSlug: string;
  posts: Post[];
};

export type SeriesListItem = {
  id: string;
  seriesName: string;
  description: string;
  postCount: number;
  thumbnail: string;
};

export async function getUserSeries(slug: string): Promise<SeriesListItem[]> {
  const seriesList = await client.fetch(
    getUserSeriesQuery,
    { slug },
    {
      cache: 'force-cache',
      next: { tags: [`series/${slug}`] },
    }
  );

  return seriesList.map((series) => ({
    id: series.id,
    seriesName: series.seriesName ?? '',
    description: series.description ?? '',
    postCount: series.postCount ?? 0,
    thumbnail: series.thumbnail ?? '',
  }));
}

export async function getSeriesDetail(id: string, slug: string) {
  const series = await client.fetch(
    getSeriesDetailQuery,
    { id },
    {
      cache: 'force-cache',
      next: { tags: [`series/${slug}`] },
    }
  );

  if (!series) return null;

  return {
    id: series.id,
    seriesName: series.seriesName ?? '',
    description: series.description ?? '',
    authorSlug: series.authorSlug ?? '',
    posts: mapPosts(series.posts ?? []),
  };
}

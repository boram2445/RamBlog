import { simplePostProjection } from './posts';
import { client } from './sanity';

export async function searchAllPosts(keyword: string) {
  return client.fetch(
    `*[_type == "post" && (author->username match $keyword || title match $keyword || description match $keyword || tags[]->tagName  match $keyword)]
    | order(coalesce(publishedAt, _createdAt) desc){${simplePostProjection}}`,
    { keyword: `*${keyword}*` },
    { cache: 'no-store' }
  );
}

export async function searchUserPosts(slug: string, keyword: string) {
  return client.fetch(
    `*[_type == "post" && author->slug == $slug && (title match $keyword || description match $keyword || tags[]->tagName  match $keyword)]
    | order(coalesce(publishedAt, _createdAt) desc){${simplePostProjection}}`,
    { slug, keyword: `*${keyword}*` },
    { cache: 'no-store' }
  );
}

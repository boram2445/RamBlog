import { simplePostProjection } from './posts';
import { client } from './sanity';

export async function searchAll(keyword: string) {
  return client.fetch(
    `*[_type == "post" && (username match "*${keyword}*") || (title match "*${keyword}*") || (content match "*${keyword}*")]
    | order(_createdAt desc){${simplePostProjection}}`
  );
}

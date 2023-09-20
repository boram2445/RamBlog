import { simplePostProjection } from './posts';
import { client } from './sanity';

export async function searchAllPosts(keyword: string) {
  return client.fetch(
    `*[_type == "post" && (author->username match "*${keyword}*" || title match "*${keyword}*" || description match "*${keyword}*" || tags[]->tagName  match "*${keyword}*")]
    | order(_createdAt desc){${simplePostProjection}}`
  );
}

export async function searchUserPosts(username: string, keyword: string) {
  return client.fetch(
    `*[_type == "post" && author->username == "${username}" && (title match "*${keyword}*" || description match "*${keyword}*" || tags[]->tagName  match "*${keyword}*")]
    | order(_createdAt desc){${simplePostProjection}}`
  );
}

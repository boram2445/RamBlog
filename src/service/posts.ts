import { client } from './sanity';

export type Post = {
  title: string;
  description: string;
  pinned: boolean;
  updatedAt: Date;
  createdAt: Date;
  tags: string[];
  id: string;
};

export type PostData = Post & {
  content: string;
  prev: Post | null;
  next: Post | null;
};

export function getAllPostsData(): Promise<Post[]> {
  return client.fetch(`
  *[_type == "post"]| order(_createdAt desc){
      tags,
      title,
      pinned,
      "updatedAt":_updatedAt,
      "createdAt":_createdAt,
      "id":_id
   }`);
}

export function getUnpinnedPostsData(): Promise<Post[]> {
  return client.fetch(`
  *[_type == "post" && pinned != true]| order(_createdAt desc){
      tags,
      title,
      pinned,
      "updatedAt":_updatedAt,
      "createdAt":_createdAt,
      "id":_id
   }`);
}

export async function getPinnedPostsData(): Promise<Post[]> {
  return client.fetch(`
  *[_type == "post" && pinned == true]| order(_createdAt desc){
      tags,
      title,
      pinned,
      "updatedAt":_updatedAt,
      "createdAt":_createdAt,
      "id":_id
   }`);
}

export async function getPostDetail(id: string): Promise<PostData> {
  const posts = await getAllPostsData();
  const index = posts.findIndex((post) => post.id === id);
  const prev = index - 1 < 0 ? null : posts[index - 1];
  const next = index + 1 > posts.length - 1 ? null : posts[index + 1];
  const postDetail = await client.fetch(
    `*[_type == "post" && _id == "${id}"][0]`
  );

  return { ...postDetail, prev, next };
}

export async function createPost(
  title: string,
  description: string,
  tagArr: string[],
  content: string
) {
  return client.create(
    {
      _type: 'post',
      title,
      pinned: false,
      description,
      tags: tagArr,
      content,
    },
    { autoGenerateArrayKeys: true }
  );
}

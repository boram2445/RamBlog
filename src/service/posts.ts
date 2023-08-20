import { client } from './sanity';

export type Post = {
  title: string;
  description: string;
  mainImage: string;
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

export async function getAllPostsData(): Promise<Post[]> {
  return client.fetch(
    `*[_type == "post"]| order(_createdAt desc){
      tags,
      title,
      pinned,
      mainImage,
      "updatedAt":_updatedAt,
      "createdAt":_createdAt,
      "id":_id
   }`
  );
}

export async function getPrevPost(currentDate: string) {
  return await client.fetch(
    `*[_type == "post" && _createdAt > $currentDate] | order(_createdAt asc) [0]
    {
      tags,
      title,
      pinned,
      mainImage,
      "updatedAt":_updatedAt,
      "createdAt":_createdAt,
      "id":_id
   }
    `,
    { currentDate }
  );
}

export async function getNextPost(currentDate: string) {
  return await client.fetch(
    `*[_type == "post" && _createdAt < $currentDate] | order(_createdAt desc) [0]
      {
        tags,
        title,
        pinned,
        mainImage,
        "updatedAt":_updatedAt,
        "createdAt":_createdAt,
        "id":_id
     }
      `,
    { currentDate }
  );
}

export async function getPostDetail(id: string): Promise<PostData> {
  const postDetail = await client.fetch(
    `*[_type == "post" && _id == "${id}"][0]{
        ...,
        "updatedAt":_updatedAt,
        "createdAt":_createdAt,
        "id":_id}
      `
  );
  const prevPost = await getPrevPost(postDetail.createdAt);
  const nextPost = await getNextPost(postDetail.createdAt);

  return { ...postDetail, prev: prevPost, next: nextPost };
}

export async function createPost(
  title: string,
  description: string,
  tagArr: string[],
  content: string,
  mainImage?: string
) {
  return client.create(
    {
      _type: 'post',
      title,
      pinned: false,
      description,
      tags: tagArr,
      content,
      mainImage,
    },
    { autoGenerateArrayKeys: true }
  );
}

export async function editPost(
  postId: string,
  title?: string,
  description?: string,
  tagArr?: string[],
  content?: string,
  mainImage?: string
) {
  const newData = {
    ...(title && { title }),
    ...(description && { description }),
    ...(tagArr && { tags: tagArr }),
    ...(content && { content }),
    ...(mainImage && { mainImage }),
  };
  return client
    .patch(postId) //
    .set(newData) //
    .commit();
}

export async function deletePost(postId: string) {
  return client.delete(postId);
}

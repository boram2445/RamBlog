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
  username: string;
  userImage: string;
};

export type PostData = Post & {
  content: string;
  prev: Post | null;
  next: Post | null;
};

const simplePostProjection = `
  tags,
  title,
  pinned,
  mainImage,
  "username":author->username, 
  "userImage":author->image,
  "updatedAt":_updatedAt,
  "createdAt":_createdAt,
  "id":_id
`;

export async function getAllPostsData(): Promise<Post[]> {
  return client
    .fetch(
      `*[_type == "post"]| order(_createdAt desc){${simplePostProjection}}`
    )
    .then((posts) =>
      posts.map((post: Post) => ({ ...post, pinned: post.pinned ?? false }))
    );
}

export async function getPinnedData(username: string): Promise<Post[]> {
  return client.fetch(
    `*[_type == "post" && author->username =="${username}" && pinned == true ]| order(_createdAt desc){${simplePostProjection}}`
  );
}

export async function getLatestData(username: string): Promise<Post[]> {
  return client.fetch(
    `*[_type == "post" && author->username =="${username}"]| order(_createdAt desc)[0..8] {${simplePostProjection}}`
  );
}

export async function getPrevPost(username:string,currentDate: string) {
  return client.fetch(
    `*[_type == "post" && author->username =="${username}" && _createdAt > $currentDate] | order(_createdAt asc) [0]
    {${simplePostProjection}}`,
    { currentDate }
  );
}

export async function getNextPost(username:string, currentDate: string) {
  return client.fetch(
    `*[_type == "post" && author->username =="${username}"  && _createdAt < $currentDate] | order(_createdAt desc) [0]
      {${simplePostProjection}}`,
    { currentDate }
  );
}

export async function getPostDetail(username:string, id: string): Promise<PostData> {
  const postDetail = await client.fetch(
    `*[_type == "post" && _id == "${id}"][0]{
        ...,
        "updatedAt":_updatedAt,
        "createdAt":_createdAt,
        "id":_id}
      `
  );
  const prevPost = await getPrevPost(username, postDetail?.createdAt);
  const nextPost = await getNextPost(username, postDetail?.createdAt);

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

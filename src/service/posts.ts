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
  description,
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
    `*[_type == "post" && author->username =="${username}"]| order(_createdAt desc)[0..8] { "username":author->username, title, "id":_id}`
  );
}

export async function getPrevPost(username: string, currentDate: string) {
  if (!currentDate) return null;
  return client.fetch(
    `*[_type == "post" && author->username =="${username}" && _createdAt > $currentDate ] | order(_createdAt asc) [0]
    { "username":author->username, title, "id":_id}`,
    { currentDate }
  );
}

export async function getNextPost(username: string, currentDate: string) {
  if (!currentDate) return null;
  return client.fetch(
    `*[_type == "post" && author->username =="${username}" && _createdAt < $currentDate] | order(_createdAt desc) [0]
      {${simplePostProjection}}`,
    { currentDate }
  );
}

export async function getPostDetail(
  postId: string,
  username?: string
): Promise<PostData> {
  const postDetail = await client.fetch(
    `*[_type == "post" && _id == "${postId}"][0]{
        ...,
        "updatedAt":_updatedAt,
        "createdAt":_createdAt,
        "username":author->username, 
        "userImage":author->image,
        "id":_id
      }`
  );

  const prevPost = username
    ? await getPrevPost(username, postDetail?.createdAt)
    : null;

  const nextPost = username
    ? await getNextPost(username, postDetail?.createdAt)
    : null;

  return { ...postDetail, prev: prevPost, next: nextPost };
}

export async function createPost(
  userId: string,
  title: string,
  description: string,
  tagArr: string[],
  content: string,
  mainImage?: string
) {
  return client.create(
    {
      _type: 'post',
      author: { _ref: userId },
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

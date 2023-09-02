import { client } from './sanity';
import slugify from 'slugify';

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
  "tags":tags[]->tagName,
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

export async function getAllUserPosts(username: string): Promise<Post[]> {
  return client.fetch(
    `*[_type == "post" && author->username=="${username}"]| order(_createdAt desc){${simplePostProjection}}`
  );
}

// export async function getPinnedData(username: string): Promise<Post[]> {
//   return client.fetch(
//     `*[_type == "post" && author->username =="${username}" && pinned == true ]| order(_createdAt desc){${simplePostProjection}}`
//   );
// }

// export async function getLatestData(username: string): Promise<Post[]> {
//   return client.fetch(
//     `*[_type == "post" && author->username =="${username}"]| order(_createdAt desc)[0..8] {${simplePostProjection}}`
//   );
// }

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
      {"username":author->username, title, "id":_id}`,
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
        "tags":tags[]->tagName,
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
  const tagStubs = tagArr.map((tagName) => {
    const newTagName = slugify(tagName, { lower: true });
    return {
      _id: `tag-${userId}-${newTagName}`,
      _type: 'tag',
      tagName,
      createdBy: { _ref: userId, _type: 'reference' },
    };
  });

  const tagDocs = tagStubs.map((stub) => client.createIfNotExists(stub));
  const createdTags = await Promise.all(tagDocs);

  return await client
    .transaction()
    .create({
      _type: 'post',
      author: { _ref: userId },
      title,
      pinned: false,
      description,
      tags: createdTags.map((tag) => ({ _ref: tag._id, _type: 'reference' })),
      content,
      mainImage,
    }) // 블로그 글(Post) 생성
    .commit({ autoGenerateArrayKeys: true });
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

export async function getTags(username: string): Promise<string[]> {
  return client
    .fetch(
      `*[_type == 'tag' && createdBy->username == "${username}"] {tagName}`
    )
    .then((items) => items.map((item: { tagName: string }) => item.tagName));
}

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

export async function getAllUserPosts(username: string) {
  return client.fetch(
    `*[_type == "post" && author->username=="${username}"]| order(_createdAt desc){${simplePostProjection}}`,
    {},
    {
      cache: 'force-cache',
      next: { tags: ['userPosts'] },
    }
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

// 태그를 확인하고 추가 또는 기존 태그 ID 반환하는 함수
async function checkAndAddTag(tagName: string) {
  const existingTags = await client.fetch(
    `*[_type == "tag" && tagName == "${tagName}"]`
  );
  if (existingTags.length === 0) {
    const newTag = {
      _type: 'tag',
      tagName: tagName,
    };
    const createdTag = await client.create(newTag);
    return createdTag._id;
  } else {
    return existingTags[0]._id;
  }
}

export async function createPost(
  userId: string,
  title: string,
  content: string,
  description?: string,
  tagArr?: string[],
  mainImage?: string
) {
  const newData: {
    _type: string;
    author: { _ref: string };
    title: string;
    pinned: boolean;
    content: string;
    description?: string;
    tags?: { _ref: string; _type: string }[];
    mainImage?: string;
  } = {
    _type: 'post',
    author: { _ref: userId },
    title,
    pinned: false,
    content,
    ...(description && { description }),
    ...(mainImage && { mainImage }),
  };

  if (tagArr && tagArr.length !== 0) {
    const tagRefs = await Promise.all(
      tagArr.map((tagName) => checkAndAddTag(tagName))
    );
    newData.tags = tagRefs.map((tagRef) => ({
      _ref: tagRef,
      _type: 'reference',
    }));
  }

  return client
    .transaction()
    .create(newData)
    .commit({ autoGenerateArrayKeys: true });
}

export async function editPost(
  postId: string,
  title: string,
  content: string,
  description?: string,
  tagArr?: string[],
  mainImage?: string
) {
  const newData: {
    title: string;
    content: string;
    description?: string;
    tags?: { _ref: string; _type: string }[];
    mainImage?: string;
  } = {
    title,
    content,
    ...(description && { description }),
    ...(mainImage && { mainImage }),
  };

  if (tagArr) {
    const tagRefs = await Promise.all(
      tagArr.map((tagName) => checkAndAddTag(tagName))
    );
    newData.tags = tagRefs.map((tagRef) => ({
      _ref: tagRef,
      _type: 'reference',
    }));
  }

  return client
    .patch(postId) //
    .set(newData) //
    .commit({ autoGenerateArrayKeys: true });
}

export async function deletePost(postId: string) {
  return client.delete(postId);
}

export async function getTags(
  username: string
): Promise<{ name: string; count: number }[]> {
  return client
    .fetch(
      `*[_type == 'post' && author->username == '${username}'].tags[]->tagName`,
      {},
      {
        cache: 'force-cache',
        next: { tags: ['userTags'] },
      }
    )
    .then((tagList) => {
      const tagCountMap: { [tag: string]: number } = {};
      tagList.forEach((tag: string) => {
        if (tag === null) return;
        tagCountMap[tag] ? tagCountMap[tag]++ : (tagCountMap[tag] = 1);
      });

      const result = Object.entries(tagCountMap).map(([name, count]) => ({
        name,
        count,
      }));
      return result;
    });
}

export async function getTagPosts(username: string, tag: string) {
  return client.fetch(
    `*[_type == 'post' && author->username == "${username}"  && "${tag}" in tags[]->tagName]| order(_createdAt desc){${simplePostProjection}}`
  );
}

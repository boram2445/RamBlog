import { defineQuery } from 'groq';
import { PostData, SimplePost } from '@/model/post';
import { AllPostsQueryResult } from '@/sanity/types';
import { client } from './sanity';

export const simplePostProjection = `
  title,
  description,
  mainImage,
  pinned,
  "updatedAt":_updatedAt,
  "createdAt":coalesce(publishedAt, _createdAt),
  "tags":tags[]->tagName,
  "username":author->username,
  "name":author->name,
  "userImage":author->image,
  "likes":count(likes),
  "id":_id
`;

const fullPostProjection = `
  ...,
  "tags":tags[]->tagName,
  "updatedAt":_updatedAt,
  "createdAt":coalesce(publishedAt, _createdAt),
  "username":author->username,
  "userImage":author->image,
  "likes":likes[]->username,
  "id":_id
`;

const allPostsQuery = defineQuery(`
  *[_type == "post"]| order(coalesce(publishedAt, _createdAt) desc){${simplePostProjection}}
`);

const userPostsQuery = defineQuery(`
  *[_type == "post" && author->username == $username]| order(coalesce(publishedAt, _createdAt) desc){${simplePostProjection}}
`);

// NOTE: 파라미터명 $tag가 아니라 $tagName — @sanity/client의 QueryParams가 `tag`를
// (CDN 요청 옵션과 혼동 방지용) 예약 키로 막아둠(tag?: never)
const tagPostsQuery = defineQuery(`
  *[_type == 'post' && $tagName in tags[]->tagName]| order(coalesce(publishedAt, _createdAt) desc){${simplePostProjection}}
`);

const bookmarkPostsQuery = defineQuery(`
  *[_type == "post" && _id in *[_type == "user" && username == $username].bookmarks[]._ref]
  | order(coalesce(publishedAt, _createdAt) desc){${simplePostProjection}}
`);

const userTagPostsQuery = defineQuery(`
  *[_type == 'post' && author->username == $username && $tagName in tags[]->tagName]| order(coalesce(publishedAt, _createdAt) desc){${simplePostProjection}}
`);

const postDetailQuery = defineQuery(`
  *[_type == "post" && _id == $postId][0]{
    'currentPost': {${fullPostProjection}},
    'nextPost': *[_type == 'post' && author->username == $username && coalesce(publishedAt, _createdAt) < coalesce(^.publishedAt, ^._createdAt)][0]{ "username":author->username, title, "id":_id},
    'previousPost': *[_type == 'post' && author->username == $username && coalesce(publishedAt, _createdAt) > coalesce(^.publishedAt, ^._createdAt)] | order(coalesce(publishedAt, _createdAt) asc)[0]{ "username":author->username, title, "id":_id}
  }
`);

const postDetailLikeQuery = defineQuery(`
  *[_type == "post" && _id == $postId][0]{
    "likes":likes[]->username,
  }.likes
`);

const existingTagQuery = defineQuery(`
  *[_type == "tag" && tagName == $tagName]
`);

const userPostTagsQuery = defineQuery(`
  *[_type == 'post' && author->username == $username].tags[]->tagName
`);

const postAuthorQuery = defineQuery(`
  *[_type == "post" && _id == $postId][0]{ "authorId": author->_id }
`);

// simplePostProjection을 공유하는 5개 list 쿼리의 결과 요소 타입 — 구조 동일
type SimplePostProjectionResult = AllPostsQueryResult[number];

// TODO(Day 11): typegen 쿼리 결과 타입을 공개 반환 타입(SimplePost)으로 전면 채택하며
// nullable 필드 정합을 맞추고 이 캐스트 제거
function mapPosts(posts: SimplePostProjectionResult[]): SimplePost[] {
  return posts.map((post) => ({
    ...post,
    tags: post.tags ?? [],
    pinned: post.pinned ?? false,
    likes: post.likes ?? 0,
  })) as unknown as SimplePost[];
}

export async function getAllPostsData(): Promise<SimplePost[]> {
  return client
    .fetch(
      allPostsQuery,
      {},
      {
        cache: 'force-cache',
        next: { tags: ['posts'] },
      }
    )
    .then(mapPosts);
}

export async function getAllUserPosts(username: string) {
  return client
    .fetch(
      userPostsQuery,
      { username },
      {
        cache: 'force-cache',
        next: { tags: [`posts/${username}`] },
      }
    )
    .then(mapPosts);
}

export async function getTagPosts(tag: string) {
  return client
    .fetch(
      tagPostsQuery,
      { tagName: tag },
      {
        cache: 'force-cache',
        next: { tags: ['posts'] },
      }
    )
    .then(mapPosts);
}

export async function getBookmarkPosts(username: string) {
  return client
    .fetch(
      bookmarkPostsQuery,
      { username },
      {
        cache: 'force-cache',
        next: { tags: ['bookmark'] },
      }
    )
    .then(mapPosts);
}

export async function getUserTagPosts(username: string, tag: string) {
  return client
    .fetch(
      userTagPostsQuery,
      { username, tagName: tag },
      {
        cache: 'force-cache',
        next: { tags: [`posts/${username}`] },
      }
    )
    .then(mapPosts);
}

export async function getPostDetail(
  postId: string,
  username: string
): Promise<PostData> {
  const postDetail = await client.fetch(
    postDetailQuery,
    { postId, username },
    {
      cache: 'force-cache',
      next: { tags: [`posts/${username}`] },
    }
  );

  // TODO(Day 11): typegen 쿼리 결과 타입을 공개 반환 타입으로 전면 채택하며 이 캐스트 제거
  return postDetail as unknown as PostData;
}

export async function getPostDetailLike(postId: string) {
  const res = await client
    .fetch(
      postDetailLikeQuery,
      { postId },
      {
        cache: 'force-cache',
        next: { tags: ['like'] },
      }
    )
    .then((res) => res ?? []);
  return res;
}

// 태그를 확인하고 추가 또는 기존 태그 ID 반환하는 함수
async function checkAndAddTag(tagName: string) {
  const existingTags = await client.fetch(
    existingTagQuery,
    { tagName },
    { cache: 'no-store' }
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
    publishedAt: string;
    description?: string;
    tags?: { _ref: string; _type: string }[];
    mainImage?: string;
    likes: { _ref: string }[];
  } = {
    _type: 'post',
    author: { _ref: userId },
    title,
    pinned: false,
    content,
    publishedAt: new Date().toISOString(),
    ...(description && { description }),
    ...(mainImage && { mainImage }),
    likes: [],
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

export async function getPostAuthorId(postId: string) {
  return client.fetch(
    postAuthorQuery,
    { postId },
    { cache: 'no-store' }
  );
}

export async function getTags(
  username: string
): Promise<{ name: string; count: number }[]> {
  return client
    .fetch(
      userPostTagsQuery,
      { username },
      {
        cache: 'force-cache',
        next: { tags: [`tags/${username}`] },
      }
    )
    .then((tagList) => {
      const tagCountMap: { [tag: string]: number } = {};
      tagList?.forEach((tag: string | null) => {
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

export async function likePost(postId: string, userId: string) {
  return client
    .patch(postId) //
    .setIfMissing({ likes: [] })
    .append('likes', [
      {
        _ref: userId,
        _type: 'reference',
      },
    ])
    .commit({ autoGenerateArrayKeys: true });
}

export async function dislikePost(postId: string, userId: string) {
  // NOTE: patch().unset() predicate는 client.fetch의 파라미터 바인딩 대상이 아니라
  // 문자열 보간이 남음. userId는 세션에서 유래한 Sanity _id(사용자 자유 입력 아님)라
  // 위험은 낮지만, 엄밀한 해결은 _id 형식 검증 — 트래킹: week2-issues.md
  return client
    .patch(postId)
    .unset([`likes[_ref=="${userId}"]`])
    .commit({ autoGenerateArrayKeys: true });
}

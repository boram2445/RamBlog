import { defineQuery } from 'groq';
import { PostData, SimplePost } from '@/model/post';
import { AllPostsQueryResult } from '@/sanity/types';
import { client } from './sanity';

export const POSTS_PER_PAGE = 10;

export const simplePostProjection = `
  title,
  description,
  mainImage,
  pinned,
  "updatedAt":_updatedAt,
  "createdAt":coalesce(publishedAt, _createdAt),
  "tags":tags[]->tagName,
  "username":author->username,
  "slug":author->slug,
  "name":author->name,
  "userImage":author->image,
  "likes":count(likes),
  "id":_id
`;

const fullPostProjection = `
  ...,
  "tags":tags[]->tagName,
  "series": series->seriesName,
  "updatedAt":_updatedAt,
  "createdAt":coalesce(publishedAt, _createdAt),
  "username":author->username,
  "slug":author->slug,
  "userImage":author->image,
  "authorId":author._ref,
  "likes":likes[]._ref,
  "id":_id
`;

const allPostsQuery = defineQuery(`
  *[_type == "post"]| order(coalesce(publishedAt, _createdAt) desc){${simplePostProjection}}
`);

const userPostsBaseFilter = `_type == "post" && author->slug == $slug`;
// $tagName이 null이면 태그 필터를 건너뛴다 — 전체/태그 목록을 쿼리 하나로 처리
const userPostsPageFilter = `${userPostsBaseFilter} && ($tagName == null || $tagName in tags[]->tagName)`;

// NOTE: 슬라이스 `[$start...$end]`에 공백을 넣지 말 것. @sanity/codegen이 슬라이스 안의
// 파라미터를 정규식으로 추출해 typegen에 주입하는데, 공백이 있으면 추출에 실패해
// `slicing must use constant numbers`로 typegen이 죽는다.
const userPostsPageQuery = defineQuery(`
  {
    "items": *[${userPostsPageFilter}]| order(coalesce(publishedAt, _createdAt) desc)[$start...$end]{${simplePostProjection}},
    "total": count(*[${userPostsPageFilter}]),
    "totalAll": count(*[${userPostsBaseFilter}])
  }
`);

// NOTE: 파라미터명 $tag가 아니라 $tagName — @sanity/client의 QueryParams가 `tag`를
// (CDN 요청 옵션과 혼동 방지용) 예약 키로 막아둠(tag?: never)
const tagPostsQuery = defineQuery(`
  *[_type == 'post' && $tagName in tags[]->tagName]| order(coalesce(publishedAt, _createdAt) desc){${simplePostProjection}}
`);

const bookmarkPostsQuery = defineQuery(`
  *[_type == "post" && _id in *[_type == "user" && slug == $slug].bookmarks[]._ref]
  | order(coalesce(publishedAt, _createdAt) desc){${simplePostProjection}}
`);

const postDetailQuery = defineQuery(`
  *[_type == "post" && _id == $postId][0]{
    'currentPost': {${fullPostProjection}},
    'nextPost': *[_type == 'post' && author->slug == $slug && coalesce(publishedAt, _createdAt) < coalesce(^.publishedAt, ^._createdAt)][0]{ "username":author->username, "slug":author->slug, title, "id":_id},
    'previousPost': *[_type == 'post' && author->slug == $slug && coalesce(publishedAt, _createdAt) > coalesce(^.publishedAt, ^._createdAt)] | order(coalesce(publishedAt, _createdAt) asc)[0]{ "username":author->username, "slug":author->slug, title, "id":_id}
  }
`);

const existingTagQuery = defineQuery(`
  *[_type == "tag" && tagName == $tagName]
`);

const existingSeriesQuery = defineQuery(`
   *[_type == "series" && seriesName == $name && author._ref == $userId]
`);

const userPostTagsQuery = defineQuery(`
  *[_type == 'post' && author->slug == $slug].tags[]->tagName
`);

const postAuthorQuery = defineQuery(`
  *[_type == "post" && _id == $postId][0]{ "authorId": author->_id }
`);

// simplePostProjection을 공유하는 list 쿼리들의 결과 요소 타입 — 구조 동일
type SimplePostProjectionResult = AllPostsQueryResult[number];

// typegen 결과는 스키마상 대부분 nullable — 서비스 경계에서 SimplePost(non-null)로 정규화
export function mapPosts(posts: SimplePostProjectionResult[]): SimplePost[] {
  return posts.map((post) => ({
    title: post.title ?? '',
    description: post.description ?? '',
    mainImage: post.mainImage ?? '',
    pinned: post.pinned ?? false,
    updatedAt: post.updatedAt,
    createdAt: post.createdAt,
    tags: post.tags?.filter((tag): tag is string => tag !== null) ?? [],
    username: post.username ?? '',
    slug: post.slug ?? '',
    name: post.name ?? '',
    userImage: post.userImage ?? '',
    likes: post.likes ?? 0,
    id: post.id,
  }));
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

export type UserPostsPage = {
  posts: SimplePost[];
  /** 태그 필터가 반영된 개수 — 페이지 수 계산용 */
  total: number;
  /** 필터와 무관한 유저의 전체 포스트 수 — 헤딩 표시용 */
  totalAll: number;
  totalPages: number;
};

export async function getUserPostsPage(
  slug: string,
  { page, tag }: { page: number; tag?: string }
): Promise<UserPostsPage> {
  const start = (page - 1) * POSTS_PER_PAGE;

  const { items, total, totalAll } = await client.fetch(
    userPostsPageQuery,
    // NOTE: undefined를 넘기면 @sanity/client가 파라미터를 요청에서 통째로 빼버려
    // `param $tagName referenced, but not provided` 에러가 난다. 반드시 null.
    { slug, tagName: tag ?? null, start, end: start + POSTS_PER_PAGE },
    {
      cache: 'force-cache',
      next: { tags: [`posts/${slug}`] },
    }
  );

  return {
    posts: mapPosts(items),
    total,
    totalAll,
    totalPages: Math.ceil(total / POSTS_PER_PAGE),
  };
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

export async function getBookmarkPosts(slug: string) {
  return client
    .fetch(
      bookmarkPostsQuery,
      { slug },
      {
        cache: 'force-cache',
        next: { tags: ['bookmark'] },
      }
    )
    .then(mapPosts);
}

export async function getPostDetail(
  postId: string,
  slug: string
): Promise<PostData | null> {
  const postDetail = await client.fetch(
    postDetailQuery,
    { postId, slug },
    {
      cache: 'force-cache',
      next: { tags: [`posts/${slug}`] },
    }
  );

  if (!postDetail) return null;

  const { currentPost, nextPost, previousPost } = postDetail;

  return {
    currentPost: {
      title: currentPost.title ?? '',
      description: currentPost.description ?? '',
      mainImage: currentPost.mainImage ?? '',
      pinned: currentPost.pinned ?? false,
      updatedAt: currentPost.updatedAt,
      createdAt: currentPost.createdAt,
      tags:
        currentPost.tags?.filter((tag): tag is string => tag !== null) ?? [],
      username: currentPost.username ?? '',
      slug: currentPost.slug ?? '',
      userImage: currentPost.userImage ?? '',
      id: currentPost.id,
      content: currentPost.content ?? '',
      likes: currentPost.likes ?? [],
      authorId: currentPost.authorId ?? '',
      series: currentPost.series ?? '',
    },
    nextPost: nextPost
      ? {
          username: nextPost.username ?? '',
          slug: nextPost.slug ?? '',
          title: nextPost.title ?? '',
          id: nextPost.id,
        }
      : undefined,
    previousPost: previousPost
      ? {
          username: previousPost.username ?? '',
          slug: previousPost.slug ?? '',
          title: previousPost.title ?? '',
          id: previousPost.id,
        }
      : undefined,
  };
}

// 시리즈를 추가하고 확인하는 함수
async function checkAndAddSeries(seriesName: string, userId: string) {
  const existingSeires = await client.fetch(
    existingSeriesQuery,
    { name: seriesName, userId },
    { cache: 'no-store' }
  );
  if (existingSeires.length === 0) {
    const createdSeries = await client.create({
      _type: 'series',
      seriesName,
      author: { _ref: userId },
    });

    return createdSeries._id;
  } else {
    return existingSeires[0]._id;
  }
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
  mainImage?: string,
  seriesName?: string
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
  return client.fetch(postAuthorQuery, { postId }, { cache: 'no-store' });
}

export async function getTags(
  slug: string
): Promise<{ name: string; count: number }[]> {
  return client
    .fetch(
      userPostTagsQuery,
      { slug },
      {
        cache: 'force-cache',
        next: { tags: [`tags/${slug}`] },
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

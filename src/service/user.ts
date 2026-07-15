import { defineQuery } from 'groq';
import { HomeUser, Links, OAuthUser, ProfileUser } from '@/model/user';
import { client } from './sanity';
import { uploadImage } from './image';

const checkUsernameValidQuery = defineQuery(`
  *[_type=='user' && username == $username][0]
`);

const checkSlugValidQuery = defineQuery(`
  *[_type=='user' && slug == $slug][0]
`);

const checkEmailValidQuery = defineQuery(`
  *[_type=='user' && email == $email][0]
`);

const loginWithEmailQuery = defineQuery(`
  *[_type=='user' && email == $email][0]{
    "id":_id,
    email,
    name,
    username,
    slug,
    password,
    image,
  }
`);

const userSlugByIdQuery = defineQuery(`
  *[_type=='user' && _id == $id][0].slug
`);

const userDataQuery = defineQuery(`
  *[_type=='user' && _id == $userId][0]
  {"id":_id,name,username,email,image,blogName}
`);

const userBySlugQuery = defineQuery(`
  *[_type == "user" && slug == $slug][0]{
    ...,
    "id":_id,
    following[]->{"id":_id,username,slug,name,image,title},
    followers[]->{"id":_id,username,slug,name,image,title},
    "bookmarks":bookmarks[]->_id
  }
`);

const userForProfileQuery = defineQuery(`
  *[_type=='user' && slug == $slug][0]{
    ...,
    "id":_id,
    "following":count(following),
    "followers":count(followers),
    "posts":count(*[_type=="post" && author->slug == $slug])
  }
`);

export async function addUser({
  id,
  username,
  slug,
  email,
  image,
  name,
}: OAuthUser) {
  return client.createIfNotExists({
    _id: id,
    _type: 'user',
    username,
    slug,
    email,
    name,
    image,
    blogName: name,
    title: `${name}`,
    introduce: `안녕하세요 ${name}의 멋진 블로그입니다 :)`,
    following: [],
    followers: [],
    bookmarks: [],
  });
}

export async function addEmailUser({
  name,
  username,
  email,
  password,
  slug,
}: {
  name: string;
  username: string;
  email: string;
  password: string;
  slug: string;
}) {
  return client.create({
    _type: 'user',
    username,
    email,
    password,
    name,
    image: '',
    blogName: name,
    title: `${name}`,
    introduce: `안녕하세요 ${name}의 멋진 블로그입니다 :)`,
    following: [],
    followers: [],
    bookmarks: [],
    slug,
  });
}

export async function checkUsernameValid(username: string) {
  const isExistUsername = await client.fetch(
    checkUsernameValidQuery,
    { username },
    { cache: 'no-store' }
  );
  return !!isExistUsername;
}

export async function checkSlugValid(slug: string) {
  const isExistSlug = await client.fetch(
    checkSlugValidQuery,
    { slug },
    { cache: 'no-store' }
  );
  return !!isExistSlug;
}

export async function generateUniqueSlug(base: string): Promise<string> {
  const taken = await checkSlugValid(base);
  return taken ? `${base}-${Math.random().toString(36).slice(2, 6)}` : base;
}

export async function checkEmailValid(email: string) {
  const isExistEmail = await client.fetch(
    checkEmailValidQuery,
    { email },
    { cache: 'no-store' }
  );
  return !!isExistEmail;
}

export async function loginWithEmail(email: string) {
  return client.fetch(loginWithEmailQuery, { email }, { cache: 'no-store' });
}

export async function getUserSlug(id: string): Promise<string | null> {
  const slug = await client.fetch(
    userSlugByIdQuery,
    { id },
    { cache: 'no-store' }
  );
  return slug ?? null;
}

export async function getUserData(userId: string, slug: string) {
  return client.fetch(
    userDataQuery,
    { userId },
    {
      cache: 'force-cache',
      next: { tags: [`profile/${slug}`] },
    }
  );
}

const defaultLinks: Links = {
  github: '',
  email: '',
  twitter: '',
  facebook: '',
  youtube: '',
  homePage: '',
};

function toSimpleUser(member: {
  id: string;
  username: string | null;
  slug: string | null;
  name: string | null;
  image: string | null;
  title: string | null;
}) {
  return {
    id: member.id,
    username: member.username ?? '',
    slug: member.slug ?? '',
    name: member.name ?? '',
    image: member.image ?? '',
    title: member.title ?? '',
  };
}

export async function getUserBySlug(slug: string): Promise<HomeUser | null> {
  const user = await client.fetch(
    userBySlugQuery,
    { slug },
    {
      cache: 'force-cache',
      next: { tags: ['following', 'bookmark'] },
    }
  );

  if (!user) return null;

  return {
    id: user.id,
    name: user.name ?? '',
    username: user.username ?? '',
    slug: user.slug ?? '',
    email: user.email ?? '',
    image: user.image,
    blogName: user.blogName ?? '',
    title: user.title ?? '',
    introduce: user.introduce ?? '',
    links: user.links ?? defaultLinks,
    following: (user.following ?? []).map(toSimpleUser),
    followers: (user.followers ?? []).map(toSimpleUser),
    bookmarks: user.bookmarks ?? [],
  };
}

export async function getUserForProfile(
  slug: string
): Promise<ProfileUser | null> {
  const user = await client.fetch(
    userForProfileQuery,
    { slug },
    {
      cache: 'force-cache',
      next: { tags: [`profile/${slug}`, 'following'] },
    }
  );

  if (!user) return null;

  return {
    id: user.id,
    name: user.name ?? '',
    username: user.username ?? '',
    slug: user.slug ?? '',
    email: user.email ?? '',
    image: user.image,
    following: user.following ?? 0,
    followers: user.followers ?? 0,
    blogName: user.blogName ?? '',
    title: user.title ?? '',
    introduce: user.introduce ?? '',
    links: user.links ?? defaultLinks,
    posts: user.posts,
  };
}

export async function editProfile(
  userId: string,
  name: string,
  title: string,
  introduce?: string,
  links?: Links,
  image?: Blob
) {
  const imageRes = image && (await uploadImage(image));

  const newData = !imageRes
    ? { name, title, introduce, links }
    : {
        name,
        title,
        introduce,
        links,
        image: imageRes.document.url,
      };

  return client.patch(userId).set(newData).commit();
}

export async function follow(myId: string, targetId: string) {
  return client
    .transaction() //
    .patch(myId, (user) =>
      user
        .setIfMissing({ following: [] })
        .append('following', [{ _ref: targetId, _type: 'reference' }])
    )
    .patch(targetId, (user) =>
      user
        .setIfMissing({ followers: [] })
        .append('followers', [{ _ref: myId, _type: 'reference' }])
    )
    .commit({ autoGenerateArrayKeys: true });
}

export async function unfollow(myId: string, targetId: string) {
  // NOTE: patch().unset() predicate는 client.fetch의 파라미터 바인딩 대상이 아니라
  // 문자열 보간이 남음. myId/targetId는 세션에서 유래한 Sanity _id(사용자 자유 입력 아님)라
  // 위험은 낮지만, 엄밀한 해결은 _id 형식 검증 — 트래킹: week2-issues.md
  return client
    .transaction() //
    .patch(myId, (user) => user.unset([`following[_ref=="${targetId}"]`]))
    .patch(targetId, (user) => user.unset([`followers[_ref=="${myId}"]`]))
    .commit({ autoGenerateArrayKeys: true });
}

export async function addBookmark(userId: string, postId: string) {
  return client
    .patch(userId) //
    .setIfMissing({ bookmarks: [] })
    .append('bookmarks', [
      {
        _ref: postId,
        _type: 'reference',
      },
    ])
    .commit({ autoGenerateArrayKeys: true });
}

export async function removeBookmark(userId: string, postId: string) {
  // NOTE: patch().unset() predicate는 client.fetch의 파라미터 바인딩 대상이 아니라
  // 문자열 보간이 남음. postId는 세션에서 유래한 Sanity _id(사용자 자유 입력 아님)라
  // 위험은 낮지만, 엄밀한 해결은 _id 형식 검증 — 트래킹: week2-issues.md
  return client
    .patch(userId)
    .unset([`bookmarks[_ref=="${postId}"]`])
    .commit({ autoGenerateArrayKeys: true });
}

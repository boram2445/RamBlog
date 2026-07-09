import { defineQuery } from 'groq';
import { HomeUser, Links, OAuthUser, ProfileUser } from '@/model/user';
import { client } from './sanity';
import { uploadImage } from './image';

const checkUsernameValidQuery = defineQuery(`
  *[_type=='user' && username == $username][0]
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
    password,
    image,
  }
`);

const userDataQuery = defineQuery(`
  *[_type=='user' && _id == $userId][0]
  {"id":_id,name,username,email,image,blogName}
`);

const userByUsernameQuery = defineQuery(`
  *[_type == "user" && username == $username][0]{
    ...,
    "id":_id,
    following[]->{"id":_id,username,name,image,title},
    followers[]->{"id":_id,username,name,image,title},
    "bookmarks":bookmarks[]->_id
  }
`);

const userForProfileQuery = defineQuery(`
  *[_type=='user' && username == $username][0]{
    ...,
    "id":_id,
    "following":count(following),
    "followers":count(followers),
    "posts":count(*[_type=="post" && author->username == $username])
  }
`);

export async function addUser({ id, username, email, image, name }: OAuthUser) {
  return client.createIfNotExists({
    _id: id,
    _type: 'user',
    username,
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
}: {
  name: string;
  username: string;
  email: string;
  password: string;
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

export async function checkEmailValid(email: string) {
  const isExistEmail = await client.fetch(
    checkEmailValidQuery,
    { email },
    { cache: 'no-store' }
  );
  return !!isExistEmail;
}

export async function loginWithEmail(email: string) {
  const user = await client.fetch(
    loginWithEmailQuery,
    { email },
    { cache: 'no-store' }
  );

  // TODO(Day 11 #3): typegen 쿼리 결과 타입을 공개 반환 타입으로 전면 채택하며 이 캐스트 제거.
  // 반환 shape은 src/auth.ts의 credentials authorize 콜백 소비 형태를 그대로 반영(기존엔 암묵적 any).
  return user as unknown as {
    id: string;
    email: string;
    name: string;
    username: string;
    password: string;
    image?: string;
  } | null;
}

export async function getUserData(userId: string, username: string) {
  return client.fetch(
    userDataQuery,
    { userId },
    {
      cache: 'force-cache',
      next: { tags: [`profile/${username}`] },
    }
  );
}

export async function getUserByUsername(username: string): Promise<HomeUser> {
  const user = await client.fetch(
    userByUsernameQuery,
    { username },
    {
      cache: 'force-cache',
      next: { tags: ['following', 'bookmark'] },
    }
  );

  // TODO(Day 11 #3): typegen 쿼리 결과 타입을 공개 반환 타입으로 전면 채택하며 이 캐스트 제거
  return user as unknown as HomeUser;
}

export async function getUserForProfile(
  username: string
): Promise<ProfileUser> {
  return client
    .fetch(
      userForProfileQuery,
      { username },
      {
        cache: 'force-cache',
        next: { tags: [`profile/${username}`, 'following'] },
      }
    )
    .then(
      (user) =>
        ({
          ...user,
          following: user?.following ?? 0,
          followers: user?.followers ?? 0,
          links: user?.links ?? {
            github: '',
            email: '',
            twitter: '',
            facebook: '',
            youtube: '',
            homePage: '',
          },
          // TODO(Day 11 #3): typegen 쿼리 결과 타입을 공개 반환 타입으로 전면 채택하며 이 캐스트 제거
        }) as unknown as ProfileUser
    );
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

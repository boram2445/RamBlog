import { HomeUser, Links, OAuthUser, ProfileUser } from '@/model/user';
import { client } from './sanity';
import { uploadImage } from './image';

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
    `*[_type=='user' && username == "${username}"][0]`
  );
  return !!isExistUsername;
}

export async function checkEmailValid(email: string) {
  const isExistEmail = await client.fetch(
    `*[_type=='user' && email == "${email}"][0]`
  );
  return !!isExistEmail;
}

export async function loginWithEmail(email: string) {
  return await client.fetch(
    `*[_type=='user' && email == "${email}"][0]{
      "id":_id,
      email,
      name,
      username,
      password,
      image,
    }`
  );
}

export async function getUserData(userId: string, username: string) {
  return client.fetch(
    `*[_type=='user' && _id == "${userId}"][0]
    {"id":_id,name,username,email,image,blogName}`,
    {},
    {
      cache: 'force-cache',
      next: { tags: [`profile/${username}`] },
    }
  );
}

export async function getUserByUsername(username: string): Promise<HomeUser> {
  return client.fetch(
    `*[_type == "user" && username == "${username}"][0]{
      ...,
      "id":_id,
      following[]->{"id":_id,username,name,image,title},
      followers[]->{"id":_id,username,name,image,title},
      "bookmarks":bookmarks[]->_id
    }`,
    {},
    {
      cache: 'force-cache',
      next: { tags: ['following', 'bookmark'] },
    }
  );
}

export async function getUserForProfile(
  username: string
): Promise<ProfileUser> {
  return client
    .fetch(
      `*[_type=='user' && username == "${username}"][0]{
    ...,
    "id":_id,
    "following":count(following),
    "followers":count(followers),
    "posts":count(*[_type=="post" && author->username == "${username}"])
    }`,
      {},
      {
        cache: 'force-cache',
        next: { tags: [`profile/${username}`, 'following'] },
      }
    )
    .then((user) => ({
      ...user,
      following: user.following ?? 0,
      followers: user.followers ?? 0,
      links: user.links ?? {
        github: '',
        email: '',
        twitter: '',
        facebook: '',
        youtube: '',
        homePage: '',
      },
    }));
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
  return client
    .patch(userId)
    .unset([`bookmarks[_ref=="${postId}"]`])
    .commit({ autoGenerateArrayKeys: true });
}

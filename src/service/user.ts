import { HomeUser } from '@/model/user';
import { client } from './sanity';

type OAuthUser = {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  username: string;
};

export async function addUser({ id, username, email, image, name }: OAuthUser) {
  return client.createIfNotExists({
    _id: id,
    _type: 'user',
    username,
    email,
    name,
    image,
    following: [],
    followers: [],
    bookmarks: [],
  });
}

export async function getUserForProfile(username: string): Promise<HomeUser> {
  return client
    .fetch(
      `*[_type=='user' && username == "${username}"][0]{
    ...,
    "id":_id,
    "following":count(following),
    "followers":count(followers),
    "posts":count(*[_type=="post" && author->username == "${username}"])
  }`
    )
    .then((user) => ({
      ...user,
      following: user.following ?? 0,
      followers: user.followers ?? 0,
    }));
}

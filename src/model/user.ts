export type OAuthUser = {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  username: string;
  slug: string;
};

export type AuthUser = {
  id: string;
  name: string;
  username: string;
  slug: string;
  email: string;
  image?: string;
};

export type UserData = AuthUser;

export type SimpleUser = {
  id: string;
  username: string;
  slug: string;
  name: string;
  image: string;
  title: string;
};

export type ProfileUser = AuthUser & {
  following: number;
  followers: number;
  title: string;
  introduce: string;
  links: Links;
  posts: number;
};

export type HomeUser = AuthUser & {
  title: string;
  introduce: string;
  links: Links;
  following: SimpleUser[];
  followers: SimpleUser[];
  bookmarks: string[];
};

export type Links = {
  github?: string;
  email?: string;
  twitter?: string;
  facebook?: string;
  youtube?: string;
  homePage?: string;
};

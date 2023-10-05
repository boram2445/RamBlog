export type OAuthUser = {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  username: string;
};

export type AuthUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  image?: string;
};

export type UserData = AuthUser & {
  blogName: string;
};

export type SimpleUser = {
  id: string;
  username: string;
  name: string;
  image: string;
  title: string;
};

export type SearchUser = AuthUser & {
  following: number;
  followers: number;
};

export type ProfileUser = SearchUser & {
  blogName: string;
  title: string;
  introduce: string;
  links: Links;
  posts: number;
};

export type HomeUser = AuthUser & {
  blogName: string;
  title: string;
  introduce: string;
  posts: number;
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

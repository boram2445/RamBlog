export type AuthUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  image?: string;
};

export type SimpleUser = Pick<AuthUser, 'username' | 'image'>;

export type HomeUser = AuthUser & {
  links: Links;
  blogName: string;
  title: string;
  introduce: string;
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

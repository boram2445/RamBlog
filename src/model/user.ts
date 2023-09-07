export type AuthUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  image?: string;
};

export type SimpleUser = Pick<AuthUser, 'username' | 'image'>;

export type HomeUser = AuthUser & {
  links: { linkType: string; urlOrEmail: string }[];
  blogName: string;
  title: string;
  introduce: string;
  following: SimpleUser[];
  followers: SimpleUser[];
  bookmarks: string[];
};

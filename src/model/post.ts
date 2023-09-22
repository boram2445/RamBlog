export type Post = {
  title: string;
  description: string;
  mainImage: string;
  pinned: boolean;
  updatedAt: Date;
  createdAt: Date;
  tags: string[];
  username: string;
  name: string;
  userImage: string;
  id: string;
};

export type SimplePost = Post & { likes: number };

export type AdjacentPost = { username: string; title: string; id: string };

export type PostData = {
  currentPost: PostDetail;
  previousPost: AdjacentPost;
  nextPost: AdjacentPost;
};

export type PostDetail = Post & { content: string; likes: string[] };

export type Post = {
  title: string;
  description: string;
  mainImage: string;
  pinned: boolean;
  updatedAt: Date;
  createdAt: Date;
  tags: string[];
  id: string;
  username: string;
  name: string;
  userImage: string;
  likes: string[];
};

export type AdjacentPost = { username: string; title: string; id: string };

export type PostData = {
  currentPost: PostDetail;
  previousPost: AdjacentPost;
  nextPost: AdjacentPost;
};

export type PostDetail = Post & { content: string };

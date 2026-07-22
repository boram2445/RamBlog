export type Post = {
  title: string;
  description: string;
  mainImage: string;
  pinned: boolean;
  updatedAt: string;
  createdAt: string;
  tags: string[];
  username: string;
  slug: string;
  name: string;
  userImage: string;
  id: string;
};

export type SimplePost = Post & { likes: number };

export type AdjacentPost = {
  username: string;
  slug: string;
  title: string;
  id: string;
};

export type PostData = {
  currentPost: PostDetail;
  previousPost?: AdjacentPost;
  nextPost?: AdjacentPost;
};

// postDetailQuery(fullPostProjection)는 author->name을 투영하지 않음 — Post의 `name`은 제외
export type PostDetail = Omit<Post, 'name'> & {
  content: string;
  likes: string[];
  authorId: string;
  series: string;
};

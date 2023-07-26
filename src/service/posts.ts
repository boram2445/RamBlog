import path from 'path';
import { promises as fs } from 'fs';
import { cache } from 'react';

export type Post = {
  title: string;
  description: string;
  date: Date;
  category: string;
  path: string;
  featured: boolean;
};

export type PostData = Post & {
  content: string;
  prev: Post | null;
  next: Post | null;
};

export const getAllPosts = cache(async () => {
  const filePath = path.join(process.cwd(), 'data', 'posts.json');
  return await fs
    .readFile(filePath, 'utf-8')
    .then<Post[]>(JSON.parse)
    .then((posts) => posts.sort((a, b) => (a.date > b.date ? -1 : 1)));
});

export async function getPostData(fileName: string): Promise<PostData> {
  const posts = await getAllPosts();
  const post = posts.find((post) => post.path === fileName);

  if (!post)
    throw new Error(`${fileName}에 해당하는 포스트를 찾을 수 없습니다.`);

  const filePath = path.join(process.cwd(), 'data/posts', `${fileName}.md`);
  const content = await fs.readFile(filePath, 'utf-8');

  const index = posts.findIndex((post) => post.path === fileName);
  const prev = index - 1 < 0 ? null : posts[index - 1]; //최신 포스트
  const next = index + 1 > posts.length - 1 ? null : posts[index + 1]; //옛날 포스트

  return { ...post, content, prev, next };
}

export async function getFeaturedPosts(): Promise<Post[]> {
  const posts = await getAllPosts();
  return posts.filter((post) => post.featured === true);
}

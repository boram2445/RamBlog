import path from 'path';
import { promises as fs } from 'fs';

export type Post = {
  title: string;
  description: string;
  date: Date;
  category: string;
  path: string;
  featured: boolean;
};

export async function getAllPosts(): Promise<Post[]> {
  const filePath = path.join(process.cwd(), 'data', 'posts.json');
  return await fs
    .readFile(filePath, 'utf-8')
    .then<Post[]>(JSON.parse)
    .then((posts) => posts.sort((a, b) => (a.date > b.date ? -1 : 1)));
}

export async function getPost(id: string): Promise<Post | undefined> {
  const posts = await getAllPosts();
  return posts.find((post) => post.path === id);
}

export async function getFeaturedPosts(): Promise<Post[]> {
  const posts = await getAllPosts();
  return posts.filter((post) => post.featured === true);
}

export async function getMarkDown(id: string) {
  const filePath = path.join(process.cwd(), 'data/posts', `${id}.md`);
  const data = await fs.readFile(filePath, 'utf-8');
  return data;
}

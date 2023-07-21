import path from 'path';
import { promises as fs } from 'fs';

export type Post = {
  title: string;
  description: string;
  date: string;
  category: string;
  path: string;
  featured: boolean;
};

//그냥 require(경로) 해줘도 되는 것 같은데 아닐까,,
export async function getPosts(): Promise<Post[]> {
  const filePath = path.join(process.cwd(), 'data', 'posts.json');
  const data = await fs.readFile(filePath, 'utf-8');

  return JSON.parse(data);
}

export async function getPost(id: string): Promise<Post | undefined> {
  const posts = await getPosts();
  return posts.find((post) => post.path === id);
}

export async function getFeaturedPosts(): Promise<Post[]> {
  const posts = await getPosts();
  return posts.filter((post) => post.featured === true);
}

export async function getMarkDown(id: string) {
  const filePath = path.join(process.cwd(), 'data/posts', `${id}.md`);
  const data = await fs.readFile(filePath, 'utf-8');
  return data;
}

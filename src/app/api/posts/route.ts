import { createPost, getAllPostsData } from '@/service/posts';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_: Request) {
  return await getAllPostsData().then((data) => NextResponse.json(data));
}

export async function POST(req: NextRequest) {
  const form = await req.formData();

  const title = form.get('title')?.toString();
  const description = form.get('description')?.toString();
  const tags = form.get('tags')?.toString();
  const content = form.get('content')?.toString();
  const mainImage = form.get('mainImageUrl')?.toString();

  if (!title || !description || !tags || !content) {
    return new Response('Bad request', { status: 400 });
  }

  const tagArr = tags.replace(/ /g, '').split(',');

  return await createPost(title, description, tagArr, content, mainImage).then(
    (data) => NextResponse.json(data)
  );
}

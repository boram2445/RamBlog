import { createPost, getAllPostsData } from '@/service/posts';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_: Request) {
  return await getAllPostsData().then((data) => NextResponse.json(data));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, description, tags, content } = body;

  if (!title || !description || !tags || !content) {
    return new Response('Bad request', { status: 400 });
  }

  const tagArr = tags.replace(/ /g, '').split(',');

  return await createPost(title, description, tagArr, content).then((data) =>
    NextResponse.json(data)
  );
}

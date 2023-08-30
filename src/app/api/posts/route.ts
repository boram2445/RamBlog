import { authOptions } from '../auth/[...nextauth]/options';
import { createPost, getAllPostsData } from '@/service/posts';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_: Request) {
  return await getAllPostsData().then((data) => NextResponse.json(data));
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    return new Response(`Authentication Error`, { status: 401 });
  }

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
  const userId = user.id;

  const result = await createPost(
    userId,
    title,
    description,
    tagArr,
    content,
    mainImage
  ).then((data) => NextResponse.json(data));

  revalidatePath(`/[user]`);

  return result;
}

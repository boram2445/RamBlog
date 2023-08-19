import { editPost, getPostDetail } from '@/service/posts';
import { NextRequest, NextResponse } from 'next/server';

type Context = {
  params: { id: string };
};

export async function GET(_: Request, context: Context) {
  return await getPostDetail(context.params.id).then((data) =>
    NextResponse.json(data)
  );
}

export async function PATCH(req: NextRequest, context: Context) {
  const form = await req.formData();
  const id = context.params.id;

  const mainImage = form.get('mainImageUrl')?.toString();
  const title = form.get('title')?.toString();
  const description = form.get('description')?.toString();
  const tags = form.get('tags')?.toString();
  const content = form.get('content')?.toString();

  const tagArr = tags?.replace(/ /g, '').split(',');

  return await editPost(
    id,
    title,
    description,
    tagArr,
    content,
    mainImage
  ).then((data) => NextResponse.json(data));
}

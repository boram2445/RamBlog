import { withSessionUser } from '@/utils/session';
import { createPost, getAllPostsData } from '@/service/posts';
import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler, HttpError } from '@/lib/api-handler';

export const GET = withErrorHandler(async (_: Request) => {
  return await getAllPostsData().then((data) => NextResponse.json(data));
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  return withSessionUser(async (user) => {
    const form = await req.formData();
    const title = form.get('title')?.toString();
    const description = form.get('description')?.toString();
    const tags = form.get('tags')?.toString();
    const content = form.get('content')?.toString();
    const mainImage = form.get('mainImageUrl')?.toString();

    if (!title || !content) {
      throw new HttpError(400, '제목과 내용을 입력해주세요.');
    }

    const tagArr = tags?.replace(/ /g, '').split(',');
    const userId = user.id;

    const result = await createPost(
      userId,
      title,
      content,
      description,
      tagArr,
      mainImage
    ).then((data) => NextResponse.json(data));

    revalidateTag(`tags/${user.username}`, 'max');
    revalidateTag(`posts/${user.username}`, 'max');
    revalidateTag('posts', 'max');

    return result;
  });
});

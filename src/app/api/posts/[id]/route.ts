import { authOptions } from '../../auth/[...nextauth]/options';
import { deletePost, editPost } from '@/service/posts';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

type Context = {
  params: { id: string };
};

// export async function GET(_: Request, context: Context) {
//   return await getPostDetail(context.params.id).then((data) =>
//     NextResponse.json(data)
//   );
// }

export async function PATCH(req: NextRequest, context: Context) {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    return new Response(`Authentication Error`, { status: 401 });
  }

  const form = await req.formData();
  const id = context.params.id;

  const mainImage = form.get('mainImageUrl')?.toString();
  const title = form.get('title')?.toString();
  const description = form.get('description')?.toString();
  const tags = form.get('tags')?.toString();
  const content = form.get('content')?.toString();

  const tagArr = tags?.replace(/ /g, '').split(',');

  const result = await editPost(
    id,
    title,
    description,
    tagArr,
    content,
    mainImage
  ).then((data) => NextResponse.json(data));

  revalidatePath(`/`);

  return result;
}

export async function DELETE(_: NextRequest, context: Context) {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!user) {
    return new Response(`Authentication Error`, { status: 401 });
  }

  const id = context.params.id;
  if (!id) return new Response('Bad Request', { status: 400 });

  const result = await deletePost(id).then((data) => NextResponse.json(data));

  revalidatePath(`/`);

  return result;
}

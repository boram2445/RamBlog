import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { editProfile } from '@/service/user';
import { getServerSession } from 'next-auth';
import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    return new Response(`Authentication Error`, { status: 401 });
  }

  const form = await req.formData();

  const image = form.get('image') as Blob;
  const title = form.get('title')?.toString();
  const introduce = form.get('introduce')?.toString();
  const name = form.get('name')?.toString();

  if (!title || !name) {
    return new Response('Bad request', { status: 400 });
  }

  const github = form.get('github')?.toString();
  const email = form.get('email')?.toString();
  const twitter = form.get('twitter')?.toString();
  const facebook = form.get('facebook')?.toString();
  const youtube = form.get('youtube')?.toString();
  const homePage = form.get('homePage')?.toString();

  const links = {
    github,
    email,
    twitter,
    facebook,
    youtube,
    homePage,
  };

  const result = await editProfile(
    user.id,
    name,
    title,
    introduce,
    links,
    image
  ).then((data) => NextResponse.json(data));

  revalidateTag('profile');

  return result;
}

import { auth } from '@/auth';
import { editProfile, getUserBySlug } from '@/service/user';
import { withSessionUser } from '@/utils/session';
import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler, HttpError } from '@/lib/api-handler';

export const GET = withErrorHandler(async (_: Request) => {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return NextResponse.json(null, { status: 200 });
  }

  return await getUserBySlug(user.slug).then((data) =>
    NextResponse.json(data)
  );
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  return withSessionUser(async (user) => {
    const form = await req.formData();

    const image = form.get('image') as Blob;
    const title = form.get('title')?.toString();
    const introduce = form.get('introduce')?.toString();
    const name = form.get('name')?.toString();

    if (!title || !name) {
      throw new HttpError(400, '타이틀과 닉네임을 입력해주세요.');
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

    revalidateTag(`profile/${user.slug}`, { expire: 0 });

    return result;
  });
});

import { getTags } from '@/service/posts';
import { NextResponse } from "next/server";

type Context = {
  params: Promise<{ user: string }>;
};

export async function GET(_: Request, context: Context) {
  const { user } = (await context.params);

  if (!user) {
    return new NextResponse('Bad Reqest', { status: 400 });
  }

  return await getTags(user).then((data) => NextResponse.json(data));
}

import { getUserBySlug } from '@/service/user';
import { NextResponse } from "next/server";
import { withErrorHandler } from '@/lib/api-handler';

type Context = {
  params: Promise<{ user: string }>;
};

export const GET = withErrorHandler(async (_: Request, context: Context) => {
  const { user } = (await context.params);

  return await getUserBySlug(user).then((data) => NextResponse.json(data));
});

import { getUserByUsername } from '@/service/user';
import { NextResponse } from "next/server";

type Context = {
  params: Promise<{ user: string }>;
};

export async function GET(_: Request, context: Context) {
  const { user } = (await context.params);

  return await getUserByUsername(user).then((data) => NextResponse.json(data));
}

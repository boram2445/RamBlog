import { auth } from '@/auth';
import { NextResponse } from "next/server";
import { getUserData } from '@/service/user';
import { withErrorHandler } from '@/lib/api-handler';

export const GET = withErrorHandler(async (_: Request) => {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return NextResponse.json(null, { status: 200 });
  }

  return await getUserData(user.id, user.username).then((data) =>
    NextResponse.json(data)
  );
});

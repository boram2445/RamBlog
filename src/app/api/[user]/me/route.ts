import { auth } from '@/auth';
import { NextResponse } from "next/server";
import { getUserData } from '@/service/user';

export async function GET(_: Request) {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return new Response(JSON.stringify(null), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return await getUserData(user.id, user.username).then((data) =>
    NextResponse.json(data)
  );
}

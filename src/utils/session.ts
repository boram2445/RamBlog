import { auth } from "@/auth";
import { HttpError } from "@/lib/api-handler";
import { AuthUser } from "@/model/user";

export async function withSessionUser(
  handler: (user: AuthUser) => Promise<Response>,
): Promise<Response> {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    throw new HttpError(401, "로그인이 필요합니다.");
  }

  return handler(user);
}

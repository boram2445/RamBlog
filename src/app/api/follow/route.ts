import { follow, unfollow } from "@/service/user";
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { withSessionUser } from "@/utils/session";
import { HttpError, withErrorHandler } from "@/lib/api-handler";

export const PUT = withErrorHandler(async (req: NextRequest) => {
  return withSessionUser(async (user) => {
    const { id: targetId, follow: isFollow } = await req.json();

    if (!targetId || isFollow === undefined) {
      throw new HttpError(400, "잘못된 요청입니다.");
    }

    const request = isFollow ? follow : unfollow;

    const result = await request(user.id, targetId) //
      .then((res) => NextResponse.json(res));

    revalidateTag("following", "max");

    return result;
  });
});

import { revalidateTag } from "next/cache";
import { dislikePost, likePost } from "@/service/posts";
import { NextRequest, NextResponse } from "next/server";
import { withSessionUser } from "@/utils/session";
import { withErrorHandler, HttpError } from "@/lib/api-handler";

export const PUT = withErrorHandler(async (req: NextRequest) => {
  return withSessionUser(async (user) => {
    const { id, like } = await req.json();

    if (!id || like === undefined) {
      throw new HttpError(400, "잘못된 요청입니다.");
    }

    const request = like ? likePost : dislikePost;

    const result = await request(id, user.id).then((res) =>
      NextResponse.json(res),
    );

    revalidateTag(`posts/${user.slug}`, { expire: 0 });
    revalidateTag("posts", { expire: 0 });

    return result;
  });
});

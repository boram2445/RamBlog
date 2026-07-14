import { revalidateTag } from "next/cache";
import { addBookmark, removeBookmark } from "@/service/user";
import { NextRequest, NextResponse } from "next/server";
import { getBookmarkPosts } from "@/service/posts";
import { withSessionUser } from "@/utils/session";
import { HttpError, withErrorHandler } from "@/lib/api-handler";

export const GET = withErrorHandler(async (_: Request) => {
  return withSessionUser(async (user) => {
    return getBookmarkPosts(user.username).then((data) =>
      NextResponse.json(data),
    );
  });
});

export const PUT = withErrorHandler(async (req: NextRequest) => {
  return withSessionUser(async (user) => {
    const { id, bookmark } = await req.json();

    if (!id || bookmark === undefined) {
      throw new HttpError(400, "잘못된 요청입니다.");
    }

    const request = bookmark ? addBookmark : removeBookmark;

    const result = await request(user.id, id).then((res) =>
      NextResponse.json(res),
    );

    revalidateTag("bookmark", { expire: 0 });

    return result;
  });
});

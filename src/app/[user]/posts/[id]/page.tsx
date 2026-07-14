import { auth } from "@/auth";
import CommentList from "@/components/comment/CommentList";
import JsonLd from "@/components/post/JsonLd";
import PostDetail from "@/components/post/PostDetail";
import { getPostDetail } from "@/service/posts";
import type { Metadata } from "next";
import { cache } from "react";

type Props = {
  params: Promise<{
    user: string;
    id: string;
  }>;
};

const getDetail = cache(getPostDetail);

export default async function PostPage(props: Props) {
  const params = await props.params;

  const { user, id } = params;

  const session = await auth();
  const loginUserData = session?.user;

  const post = await getDetail(id, user);

  return (
    <>
      <div className="mx-auto max-w-3xl laptop:max-w-6xl laptop:px-7 pb-20 ">
        <PostDetail
          postId={id}
          currentPost={post.currentPost}
          nextPost={post.nextPost}
          previousPost={post.previousPost}
          loginUserData={loginUserData}
        />
        <CommentList
          postId={post.currentPost.id}
          postUserId={post.currentPost.authorId}
          loginUserData={loginUserData}
        />
      </div>
      <JsonLd currentPost={post.currentPost} user={user} />
    </>
  );
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;

  const { user, id } = params;

  const { title, description, mainImage, createdAt, updatedAt } = (
    await getDetail(id, user)
  )?.currentPost;

  return {
    title,
    description,
    alternates: {
      canonical: `/${user}/posts/${id}`,
    },
    openGraph: {
      type: "article",
      title,
      description,
      publishedTime: new Date(createdAt).toISOString(),
      modifiedTime: new Date(updatedAt).toISOString(),
      images: mainImage ? [mainImage] : undefined,
    },
    twitter: {
      title,
      description,
      images: mainImage ? [mainImage] : undefined,
    },
  };
}

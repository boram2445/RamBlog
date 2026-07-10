"use client";

import useFullPost from "@/hooks/useFullPost";
import PostGrid, { PostGridLoading } from "../common/PostGrid";
import NoContent from "../ui/NoContent";
import { SimplePost } from "@/model/post";

export default function FullPosts({
  initialPosts,
}: {
  initialPosts?: SimplePost[];
}) {
  const { posts, isLoading, error } = useFullPost(undefined, initialPosts);

  return (
    <>
      {isLoading && <PostGridLoading />}
      {!isLoading && !error && posts && posts.length > 0 && (
        <PostGrid posts={posts} />
      )}
      {!isLoading && !error && posts && posts.length === 0 && (
        <NoContent text="아직 등록된 포스트가 없어요😥" />
      )}
    </>
  );
}

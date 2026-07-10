import FullPosts from "@/components/post/FullPosts";
import { getAllPostsData } from "@/service/posts";

export default async function HomePage() {
  const initialPosts = await getAllPostsData();

  return (
    <div className="mx-auto max-w-3xl laptop:max-w-7xl my-10">
      <FullPosts initialPosts={initialPosts} />
    </div>
  );
}

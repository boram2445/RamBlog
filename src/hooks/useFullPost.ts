import { SimplePost } from "@/model/post";
import useSWR from "swr";
import { useSWRConfig } from "swr";

export default function useFullPost(tag?: string, fallbackData?: SimplePost[]) {
  const url = !tag ? `/api/posts` : `/api/tags/${tag}`;

  const { data: posts, error } = useSWR<SimplePost[]>(url, null, {
    fallbackData,
  });

  return { posts, isLoading: !posts, error };
}

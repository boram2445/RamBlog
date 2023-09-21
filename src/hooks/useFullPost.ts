import { Post } from '@/model/post';
import useSWR from 'swr';
import { useSWRConfig } from 'swr';

export default function useFullPost(tag?: string) {
  const url = !tag ? `/api/posts` : `/api/tags/${tag}`;

  const { data: posts, isLoading, error } = useSWR<Post[]>(url);
  const { mutate } = useSWRConfig();

  return { posts, isLoading, error };
}

import { Post } from '@/model/post';
import useSWR from 'swr';
import { useSWRConfig } from 'swr';

export default function useFullPost() {
  const { data: posts, isLoading, error } = useSWR<Post[]>(`/api/posts`);
  const { mutate } = useSWRConfig();

  return { posts, isLoading, error };
}

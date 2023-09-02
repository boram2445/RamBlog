import useSWR from 'swr';
import { useSWRConfig } from 'swr';
import { Post } from '@/service/posts';

export default function useUserPost(username: string) {
  const {
    data: posts,
    isLoading,
    error,
  } = useSWR<Post[]>(`/api/${username}/posts`);

  return { posts, isLoading, error };
}

import { Post } from '@/service/posts';
import useSWR from 'swr';

export default function usePosts() {
  const { data: posts, isLoading, error } = useSWR<Post[]>('/api/posts');

  return { posts, isLoading, error };
}

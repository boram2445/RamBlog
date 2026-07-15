import useSWR from 'swr';
import { HomeUser } from '@/model/user';

export default function useUser(slug?: string) {
  const {
    data: userProfile,
    error,
    isLoading,
  } = useSWR<HomeUser>(slug ? `/api/${slug}` : null);

  return { userProfile, error, isLoading };
}

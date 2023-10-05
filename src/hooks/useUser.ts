import useSWR from 'swr';
import { HomeUser } from '@/model/user';

export default function useUser(username?: string) {
  const {
    data: userProfile,
    error,
    isLoading,
  } = useSWR<HomeUser>(username ? `/api/${username}` : null);

  return { userProfile, error, isLoading };
}

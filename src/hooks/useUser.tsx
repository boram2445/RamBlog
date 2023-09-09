import { HomeUser } from '@/model/user';
import useSWR from 'swr';

export default function useUser(username: string) {
  console.log(username);

  const {
    data: userProfile,
    error,
    isLoading,
  } = useSWR<HomeUser>(`/api/${username}/`);

  return { userProfile, error, isLoading };
}

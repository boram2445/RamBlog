import { useSession } from 'next-auth/react';
import { HomeUser } from '@/model/user';
import useSWR from 'swr';

export default function useMe() {
  const { data: session } = useSession();
  const user = session?.user;

  const {
    data: loggedInUser,
    error,
    isLoading,
  } = useSWR<HomeUser>(user ? `/api/${user.username}/me/profile` : null);

  return { loggedInUser, error, isLoading };
}

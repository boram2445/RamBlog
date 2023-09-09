import { useSession } from 'next-auth/react';
import { HomeUser } from '@/model/user';
import useSWR, { mutate } from 'swr';
import { useCallback } from 'react';
import axios from 'axios';

async function updateFollow(targetId: string, follow: boolean) {
  return axios.put(`/api/follow`, { id: targetId, follow });
}

export default function useMe() {
  const { data: session } = useSession();
  const user = session?.user;

  const {
    data: loggedInUser,
    error,
    isLoading,
    mutate,
  } = useSWR<HomeUser>(user ? `/api/${user.username}/me/profile` : null);

  const toggleFollow = useCallback(
    (targetId: string, follow: boolean) => {
      return mutate(updateFollow(targetId, follow), { populateCache: false });
    },
    [mutate]
  );

  return { loggedInUser, error, isLoading, toggleFollow };
}

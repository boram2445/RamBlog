import { useSession } from 'next-auth/react';
import { HomeUser } from '@/model/user';
import useSWR, { mutate } from 'swr';
import { useCallback } from 'react';
import axios from 'axios';

async function updateBookmark(postId: string, bookmark: boolean) {
  return axios.put('/api/bookmarks', { id: postId, bookmark });
}

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

  const setBookmark = useCallback(
    (postId: string, bookmark: boolean) => {
      return mutate(updateBookmark(postId, bookmark), { populateCache: false });
    },
    [mutate]
  );

  return { loggedInUser, error, isLoading, toggleFollow, setBookmark };
}

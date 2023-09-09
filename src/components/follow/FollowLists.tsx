'use client';

import useUser from '@/hooks/useUser';
import { SimpleUser } from '@/model/user';

type Props = {
  username: string;
  type: 'follower' | 'following';
};

export default function FollowLists({ username, type }: Props) {
  const { userProfile, isLoading, error } = useUser(username);

  const list =
    type === 'follower' ? userProfile?.followers : userProfile?.following;
  const count = list?.length;

  return (
    <ul>
      {list?.map((user) => (
        <li key={user.id}>{user.username}</li>
      ))}
    </ul>
  );
}

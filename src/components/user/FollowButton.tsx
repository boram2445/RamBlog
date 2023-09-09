'use client';

import { ProfileUser } from '@/model/user';
import Button from '../ui/Button';
import useMe from '@/hooks/useMe';

type Props = {
  user: ProfileUser;
};

export default function FollowButton({ user }: Props) {
  const { loggedInUser, toggleFollow } = useMe();

  const showButton = loggedInUser && loggedInUser.id !== user.id;
  const following =
    loggedInUser &&
    loggedInUser.following.find((item) => item.username === user.username);
  const text = following ? '구독 취소' : '구독';

  const handleFollow = () => toggleFollow(user.id, !following);

  return (
    <>
      {showButton && (
        <Button onClick={handleFollow} color={following ? 'black' : 'white'}>
          {text}
        </Button>
      )}
    </>
  );
}

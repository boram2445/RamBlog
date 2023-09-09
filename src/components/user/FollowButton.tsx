'use client';

import { ProfileUser } from '@/model/user';
import Button from '../ui/Button';
import useMe from '@/hooks/useMe';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { PulseLoader } from 'react-spinners';

type Props = {
  user: ProfileUser;
};

export default function FollowButton({ user }: Props) {
  const { loggedInUser, toggleFollow } = useMe();

  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isFetching, setIsFetching] = useState(false);
  const isUpdating = isPending || isFetching;

  const showButton = loggedInUser && loggedInUser.id !== user.id;
  const following =
    loggedInUser &&
    loggedInUser.following.find((item) => item.username === user.username);
  const text = following ? '팔로우 취소' : '팔로우';

  const handleFollow = async () => {
    setIsFetching(true);
    await toggleFollow(user.id, !following);
    setIsFetching(false);
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <>
      {showButton && (
        <div className='relative'>
          {isUpdating && (
            <div className='absolute inset-0 flex justify-center items-center z-20'>
              <PulseLoader size='6' color='gray' />
            </div>
          )}
          <Button
            disabled={isUpdating}
            onClick={handleFollow}
            color={following ? 'black' : 'white'}
          >
            {text}
          </Button>
        </div>
      )}
    </>
  );
}

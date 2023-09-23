'use client';

import Button from '../ui/Button';
import useMe from '@/hooks/useMe';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { PulseLoader } from 'react-spinners';
import { AiOutlineCheck, AiOutlinePlus } from 'react-icons/ai';

type Props = {
  userId: string;
  username: string;
};

export default function FollowButton({ userId, username }: Props) {
  const { loggedInUser, toggleFollow } = useMe(); //로그인한 사람

  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isFetching, setIsFetching] = useState(false);
  const isUpdating = isPending || isFetching;

  const showButton = loggedInUser && loggedInUser.id !== userId;
  const following =
    loggedInUser &&
    loggedInUser.following.find((item) => item.username === username);
  const text = following ? '팔로잉' : '팔로우';

  const handleFollow = async () => {
    setIsFetching(true);
    await toggleFollow(userId, !following);
    setIsFetching(false);
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <>
      {showButton && (
        <div className='relative h-[30px]'>
          {isUpdating && (
            <div className='absolute inset-0 flex justify-center items-center z-20'>
              <PulseLoader size='6' className='text-gray-800 dark:text-white' />
            </div>
          )}
          <Button
            disabled={isUpdating}
            onClick={handleFollow}
            color={following ? 'black' : 'white'}
          >
            {following ? (
              <AiOutlineCheck className='text-white dark:text-neutral-800' />
            ) : (
              <AiOutlinePlus className='text-white' />
            )}
            {text}
          </Button>
        </div>
      )}
    </>
  );
}

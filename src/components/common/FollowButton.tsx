'use client';

import Button from '../ui/Button';
import useMe from '@/hooks/useMe';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { AiOutlineCheck, AiOutlinePlus } from 'react-icons/ai';

type Props = {
  userId: string;
};

export default function FollowButton({ userId }: Props) {
  const { loggedInUser, toggleFollow } = useMe(); //로그인한 사람

  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isFetching, setIsFetching] = useState(false);
  const isUpdating = isPending || isFetching;

  const showButton = loggedInUser && loggedInUser.id !== userId;
  const following =
    loggedInUser && loggedInUser.following.find((item) => item.id === userId);
  const text = following ? '팔로잉' : '팔로우';

  const handleFollow = async () => {
    if (isUpdating) return;
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
        <div>
          <Button
            disabled={isUpdating}
            onClick={handleFollow}
            color={following ? 'black' : 'white'}
          >
            {following ? (
              <AiOutlineCheck className="text-white dark:text-neutral-800" />
            ) : (
              <AiOutlinePlus className="text-neutral-800" />
            )}
            {text}
          </Button>
        </div>
      )}
    </>
  );
}

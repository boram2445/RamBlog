'use client';

import { ReactNode } from 'react';
import Avartar, { AvartarLoading } from '../ui/Avartar';
import { useRouter } from 'next/navigation';
import Skeleton from '../ui/Skeleton';

type Props = {
  imageUrl?: string;
  username: string;
  size?: 'small' | 'medium';
  type?: 'button' | 'link';
  onClick?: () => void;
  icon?: ReactNode;
};

export default function UserAvartar({
  imageUrl,
  username,
  size = 'small',
  type = 'link',
  onClick,
  icon,
}: Props) {
  const router = useRouter();

  return (
    <div
      className={`flex gap-2 items-center cursor-pointer ${
        type === 'button'
          ? 'hover:bg-gray-50 rounded-full px-2 py-1 dark:hover:bg-neutral-800'
          : ''
      }`}
      onClick={type === 'link' ? () => router.push(`/${username}`) : onClick}
    >
      <Avartar imageUrl={imageUrl} username={username} type={size} />
      <div
        className={`${size === 'small' && 'text-sm'} ${
          type === 'link' ? 'hover:underline' : ''
        }`}
      >
        {username}
      </div>
      {icon}
    </div>
  );
}

export function UserAvartarLoading({ size }: { size: 'small' | 'medium' }) {
  return (
    <div className='flex gap-2 items-center'>
      <AvartarLoading type={size} />
      <Skeleton className={'w-[5rem] h-[1.25rem]'} />
    </div>
  );
}

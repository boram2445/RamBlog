'use client';

import Avartar from './Avartar';
import { useRouter } from 'next/navigation';

type Props = {
  imageUrl?: string;
  username: string;
  type?: 'small' | 'big';
};

export default function UserAvartar({
  imageUrl,
  username,
  type = 'small',
}: Props) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    router.push(`/${username}`);
  };

  return (
    <div
      className='flex gap-2 items-center cursor-pointer'
      onClick={handleClick}
    >
      <Avartar imageUrl={imageUrl} username={username} type={type} />
      <div className={`${type === 'small' && 'text-sm'} hover:underline`}>
        {username}
      </div>
    </div>
  );
}

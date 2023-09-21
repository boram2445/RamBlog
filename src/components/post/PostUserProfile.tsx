'use client';

import useUser from '@/hooks/useUser';
import Avartar from '../ui/Avartar';
import LinkButtons from '../user/LinkButtons';
import { useRouter } from 'next/navigation';

type Props = {
  username: string;
};

export default function PostUserProfile({ username }: Props) {
  const { userProfile } = useUser(username);
  const router = useRouter();

  const handleClick = () => router.push(`/${username}`);

  return (
    <div className='mt-3'>
      {userProfile && (
        <div className='border-t border-gray-200 p-10 flex gap-6 items-center justify-center'>
          <div onClick={handleClick} className='cursor-pointer'>
            <Avartar
              imageUrl={userProfile?.image}
              username={username}
              type='xl'
            />
          </div>
          <div className='flex flex-col gap-2'>
            <p
              className='font-semibold hover:underline cursor-pointer'
              onClick={handleClick}
            >
              {username}
            </p>
            {userProfile?.links && <LinkButtons links={userProfile?.links} />}
          </div>
        </div>
      )}
    </div>
  );
}

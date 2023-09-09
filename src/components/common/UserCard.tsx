import { HomeUser, SimpleUser } from '@/model/user';
import FollowButton from './FollowButton';
import Avartar from '../ui/Avartar';
import { useRouter } from 'next/navigation';

type Props = {
  followUser: SimpleUser;
};

export default function UserCard({ followUser }: Props) {
  const router = useRouter();
  const { image, name, username, title } = followUser;

  return (
    <div className='flex items-center gap-3 px-2 py-3 border-b border-gray-200'>
      <div
        className='cursor-pointer'
        onClick={() => router.push(`/${username}`)}
      >
        <Avartar imageUrl={image ?? ''} username={username} type='medium' />
      </div>
      <div className='ml-1 grow flex flex-col gap-1'>
        <h3
          className='text-gray-800 hover:underline cursor-pointer font-semibold'
          onClick={() => router.push(`/${username}`)}
        >
          {name}
        </h3>
        <p className='text-sm text-gray-500'>{title}</p>
      </div>
      <FollowButton userId={followUser.id} username={followUser.username} />
    </div>
  );
}

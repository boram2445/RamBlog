import { SimpleUser } from '@/model/user';
import FollowButton from './FollowButton';
import Avatar from '../ui/Avatar';
import { useRouter } from 'next/navigation';

type Props = {
  followUser: SimpleUser;
};

export default function UserCard({ followUser }: Props) {
  const router = useRouter();
  const { image, name, username, slug, title } = followUser;

  return (
    <div className='flex items-center gap-3 px-2 py-3 border-b border-gray-200 dark:border-neutral-700'>
      <div
        className='cursor-pointer'
        onClick={() => router.push(`/${slug}`)}
      >
        <Avatar imageUrl={image ?? ''} username={username} type='medium' />
      </div>
      <div className='ml-1 grow flex flex-col gap-1'>
        <h3
          className='text-gray-800 hover:underline cursor-pointer font-semibold dark:text-slate-300'
          onClick={() => router.push(`/${slug}`)}
        >
          {name}
        </h3>
        <p className='text-sm text-gray-500 dark:text-slate-400'>{title}</p>
      </div>
      <FollowButton userId={followUser.id} />
    </div>
  );
}

import { HomeUser, SimpleUser } from '@/model/user';
import FollowButton from './FollowButton';
import Avartar from '../ui/Avartar';

type Props = {
  user: HomeUser;
  followUser: SimpleUser;
};

export default function UserCard({ user, followUser }: Props) {
  const { image, name, username, title } = followUser;

  return (
    <div className='flex gap-3 px-2 py-3 border-b border-gray-200'>
      <Avartar imageUrl={image ?? ''} username={username} type='medium' />
      <div className='grow flex flex-col gap-1'>
        <h3>{name}</h3>
        <p>{title}</p>
      </div>
      <FollowButton userId={followUser.id} username={followUser.username} />
    </div>
  );
}

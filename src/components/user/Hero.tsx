import { ProfileUser } from '@/model/user';
import Avartar from '../ui/Avartar';
import LinkButtons from './LinkButtons';
import FollowButton from './FollowButton';

type Props = {
  user: ProfileUser;
};

export default function Hero({ user }: Props) {
  return (
    <section className='relative py-7 px-12 flex gap-10'>
      <div className='p-3 border border-gray-100 rounded-full'>
        <Avartar imageUrl={user.image} username={user.username} type='max' />
      </div>
      <div className='grow mt-5 flex flex-col'>
        <div className='flex justify-between'>
          <h2 className='text-2xl font-semibold text-gray-900'>{user.title}</h2>
          <FollowButton user={user} />
        </div>
        <p className='grow my-4 text-gray-700'>{user.introduce}</p>
        <LinkButtons links={user.links} />
      </div>
    </section>
  );
}

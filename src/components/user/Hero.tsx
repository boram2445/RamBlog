import { ProfileUser } from '@/model/user';
import Avartar from '../ui/Avartar';
import LinkButtons from './LinkButtons';
import FollowButton from '../common/FollowButton';
import FollowNumButtons from './FollowNumButtons';

type Props = {
  user: ProfileUser;
};

export default function Hero({ user }: Props) {
  return (
    <section className='relative py-7 px-12 flex flex-col tablet:flex-row items-center tablet:items-stretch gap-10'>
      <div className='p-3 border border-gray-100 rounded-full'>
        <Avartar imageUrl={user.image} username={user.username} type='max' />
      </div>
      <div className='grow mt-3 flex flex-col'>
        <div className='flex justify-between'>
          <div className=' max-w-[410px]'>
            <h2 className='text-2xl font-semibold text-gray-900'>
              {user.title}
            </h2>
            <p className='grow my-4 text-gray-700 whitespace-pre-line'>
              {user.introduce}
            </p>
          </div>
          <FollowButton userId={user.id} username={user.username} />
        </div>
        <div className='flex justify-between items-center'>
          <LinkButtons links={user.links} />
          <FollowNumButtons user={user} />
        </div>
      </div>
    </section>
  );
}

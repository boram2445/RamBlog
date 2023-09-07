import { HomeUser } from '@/model/user';
import Avartar from '../ui/Avartar';
import LinkButtons from './LinkButtons';
import { BsThreeDotsVertical } from 'react-icons/bs';

type Props = {
  user: HomeUser;
};

export default function Hero({ user }: Props) {
  return (
    <section className='relative py-7 px-3 flex gap-10'>
      <button className='absolute top-12 right-7'>
        <BsThreeDotsVertical className='text-gray-500 hover:text-gray-800 w-5 h-5' />
      </button>
      <div className='p-3 border border-gray-100 rounded-full'>
        <Avartar imageUrl={user.image} username={user.username} type='max' />
      </div>
      <div className='mt-5 flex flex-col'>
        <h2 className='text-2xl font-semibold text-gray-900'>{user.title}</h2>
        <p className='grow my-4 text-gray-700'>{user.introduce}</p>
        <LinkButtons links={user.links} />
      </div>
    </section>
  );
}

import { HomeUser } from '@/model/user';
import Avartar from '../ui/Avartar';
import LinkButtons from './LinkButtons';
import EditButton from './EditButton';
import { AuthUser } from '@/model/user';

type Props = {
  user: HomeUser;
  loginUser?: AuthUser;
};

export default function Hero({ user, loginUser }: Props) {
  return (
    <section className='relative py-7 px-3 flex gap-10'>
      {loginUser?.id === user.id && (
        <EditButton username={loginUser.username} />
      )}
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

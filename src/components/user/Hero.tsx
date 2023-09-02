import { HomeUser } from '@/model/user';
import Avartar from '../ui/Avartar';

type Props = {
  user: HomeUser;
};

export default function Hero({ user }: Props) {
  return (
    <section className='py-5 flex justify-center gap-10'>
      <div className='p-4 border border-gray-100 rounded-full'>
        <Avartar imageUrl={user.image} username={user.username} type='max' />
      </div>
      <div className='mt-5'>
        <h2 className='text-2xl font-semibold text-gray-900'>
          안녕하세요🙌 {user.name}입니다.
        </h2>
        <p className='my-4 text-gray-700'>
          프론트엔드 개발자를 꿈꾸고 있는 {user.name}입니다.
        </p>
      </div>
    </section>
  );
}

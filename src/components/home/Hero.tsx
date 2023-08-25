import { HomeUser } from '@/model/user';
import Avartar from '../ui/Avartar';

type Props = {
  user: HomeUser;
};

export default function Hero({ user }: Props) {
  return (
    <section className='py-5 flex flex-col items-center text-center'>
      <Avartar imageUrl={user.image} username={user.username} type='max' />
      <h2 className='my-2 text-xl font-semibold'>{`Hi, I'm ${user.name}`}</h2>
      <p className='mb-3'>
        안녕하세요😚 프론트엔드 개발자를
        <br />
        꿈꾸고 있는 {user.name}입니다.
      </p>
    </section>
  );
}

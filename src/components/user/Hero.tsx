import { HomeUser } from '@/model/user';
import Avartar from '../ui/Avartar';
import Link from 'next/link';

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
      <div className='flex gap-3'>
        <Link
          href={`/${user.username}/about`}
          className='cursor-pointer text-sm font-medium text-black-gray'
        >
          Profile
        </Link>
        <Link
          href={`/${user.username}/posts`}
          className='cursor-pointer text-sm font-medium text-black-gray'
        >
          All POSTS
        </Link>
      </div>
    </section>
  );
}

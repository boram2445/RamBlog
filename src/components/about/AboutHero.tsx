import { AuthUser } from '@/model/user';
import Title from '../ui/Title';
import Link from 'next/link';
import Button from '../ui/Button';

type Props = {
  loginUser?: AuthUser;
  username: string;
};

export default function AboutHero({ loginUser, username }: Props) {
  return (
    <div className='flex gap-5'>
      <div className='mb-6'>
        <Title title='About me' />
      </div>
      {loginUser?.username === username && (
        <Link href={`/${loginUser.username}/about/edit`} className='mt-1'>
          <Button>수정</Button>
        </Link>
      )}
    </div>
  );
}

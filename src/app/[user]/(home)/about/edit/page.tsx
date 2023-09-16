import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import AboutForm from '@/components/about/AboutForm';
import Title from '@/components/ui/Title';
import { getUserPortfolio } from '@/service/portfolio';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';

type Props = {
  params: { user: string };
};

export default async function AboutEditPage({ params: { user } }: Props) {
  const session = await getServerSession(authOptions);
  const loginUser = session?.user;

  if (!loginUser) redirect('/auth/signin');

  const portfolio = await getUserPortfolio(loginUser.username);

  return (
    <>
      <div className='flex gap-5'>
        <div className='mb-6'>
          <Title title='About Edit' />
        </div>
        {loginUser?.username === user && (
          <Link href={`/${loginUser.username}/about`} className='mt-1'>
            <Button>뒤로 가기</Button>
          </Link>
        )}
      </div>
      <AboutForm portfolio={portfolio} username={loginUser.username} />
    </>
  );
}

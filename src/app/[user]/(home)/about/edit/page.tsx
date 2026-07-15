import { auth } from '@/auth';
import AboutForm from '@/components/about/AboutForm';
import Title from '@/components/ui/Title';
import { getUserPortfolio } from '@/service/portfolio';
import { getUserForProfile } from '@/service/user';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';

type Props = {
  params: Promise<{ user: string }>;
};

export default async function AboutEditPage(props: Props) {
  const params = await props.params;

  const {
    user
  } = params;

  const session = await auth();
  const loginUser = session?.user;

  if (!loginUser) redirect('/auth/signin');

  const portfolio = await getUserPortfolio(loginUser.slug);
  const targetUser = await getUserForProfile(user);

  return (
    <>
      <div className='flex gap-5 items-center mb-6'>
        <Title title='About Edit' />
        {loginUser.id === targetUser?.id && (
          <Link href={`/${loginUser.slug}/about`} className='mt-1'>
            <Button>뒤로 가기</Button>
          </Link>
        )}
      </div>
      <AboutForm portfolio={portfolio} slug={loginUser.slug} />
    </>
  );
}

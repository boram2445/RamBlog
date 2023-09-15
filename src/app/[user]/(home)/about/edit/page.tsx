import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import AboutForm from '@/components/about/AboutForm';
import Title from '@/components/ui/Title';
import { getUserPortfolio } from '@/service/portfolio';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function AboutEditPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) redirect('/auth/signin');

  const portfolio = await getUserPortfolio(user.username);

  return (
    <>
      <div className='mb-6'>
        <Title title='About Edit' />
      </div>
      <AboutForm portfolio={portfolio} username={user.username} />
    </>
  );
}

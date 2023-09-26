import { getUserPortfolio } from '@/service/portfolio';
import { notFound } from 'next/navigation';
import AboutList from '@/components/about/AboutList';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import AboutHero from '@/components/about/AboutHero';

type Props = {
  params: { user: string };
};

export default async function AboutPage({ params: { user } }: Props) {
  const portfolio = await getUserPortfolio(user);

  if (!user) notFound();

  const session = await getServerSession(authOptions);
  const loginUser = session?.user;

  return (
    <>
      <AboutHero loginUser={loginUser} username={user} />
      <AboutList portfolio={portfolio} />
    </>
  );
}

export function generateMetadata({ params: { user } }: Props) {
  return {
    title: `${user} / About | RamBlog`,
    description: `${user} 커리어 소개`,
  };
}

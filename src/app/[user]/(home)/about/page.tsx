import { getUserPortfolio } from '@/service/portfolio';
import { getUserForProfile } from '@/service/user';
import { notFound } from 'next/navigation';
import AboutList from '@/components/about/AboutList';
import { auth } from '@/auth';
import AboutHero from '@/components/about/AboutHero';

type Props = {
  params: Promise<{ user: string }>;
};

export default async function AboutPage(props: Props) {
  const params = await props.params;

  const {
    user
  } = params;

  const portfolio = await getUserPortfolio(user);

  if (!user) notFound();

  const session = await auth();
  const loginUser = session?.user;

  const profileUser = await getUserForProfile(user);

  return (
    <>
      <AboutHero loginUser={loginUser} profileUserId={profileUser?.id} />
      <AboutList portfolio={portfolio} />
    </>
  );
}

export async function generateMetadata(props: Props) {
  const params = await props.params;

  const {
    user
  } = params;

  return {
    title: `${user} / About | RamBlog`,
    description: `${user} 커리어 소개`,
  };
}

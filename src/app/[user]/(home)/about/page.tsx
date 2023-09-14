import { Metadata } from 'next';
import Title from '@/components/ui/Title';
import { getUserPortfolio } from '@/service/portfolio';
import TagList from '@/components/common/TagList';
import { notFound } from 'next/navigation';
import AboutList from '@/components/about/AboutList';

export const metadata: Metadata = {
  title: 'About Me',
  description: '커리어 소개',
};

type Props = {
  params: { user: string };
};

export default async function AboutPage({ params: { user } }: Props) {
  const portfolio = await getUserPortfolio(user);

  if (!user) notFound();

  return (
    <>
      <div className='mb-6'>
        <Title title='About me' />
      </div>
      {!portfolio && (
        <p className='text-gray-700 text-center'>아직 등록된 소개가 없어요😥</p>
      )}
      {portfolio && (
        <div className='mx-auto max-w-screen-lg px-2 tablet:px-5 laptop:px-8'>
          <AboutList portfolio={portfolio} />
        </div>
      )}
    </>
  );
}

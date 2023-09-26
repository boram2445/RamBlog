import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import { getUserForProfile } from '@/service/user';
import Hero from '@/components/user/Hero';
import TabList from '@/components/user/TabList';

type Props = {
  params: { user: string };
  children: ReactNode;
};

export default async function UserTemplate({
  params: { user },
  children,
}: Props) {
  const userData = await getUserForProfile(user);

  if (!user) notFound();

  return (
    <div className='mx-auto max-w-3xl laptop:max-w-5xl'>
      <Hero user={userData} />
      <TabList user={userData} />
      <div className='mt-8 min-h-[500px]'>{children}</div>
    </div>
  );
}

export function generateMetadata({ params: { user } }: Props) {
  return {
    title: `${user} | RamBlog`,
    description: `${user} 블로그`,
  };
}

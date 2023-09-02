import { getUserForProfile } from '@/service/user';
import Hero from '@/components/user/Hero';
import { notFound } from 'next/navigation';
import TabList from '@/components/user/TabList';
import { ReactNode } from 'react';

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
    <>
      <Hero user={userData} />
      <TabList user={userData} />
      <div className='mt-12'>{children}</div>
    </>
  );
}

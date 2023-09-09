import { getUserForProfile } from '@/service/user';
import Hero from '@/components/user/Hero';
import { notFound } from 'next/navigation';
import TabList from '@/components/user/TabList';
import { ReactNode } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

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
    <div className='max-w-[820px] mx-auto'>
      <Hero user={userData} />
      <TabList user={userData} />
      <div className='mt-12 min-h-[500px]'>{children}</div>
    </div>
  );
}

import Hero from '@/components/home/Hero';
import PostList from '@/components/home/PostList';
import { getUserForProfile } from '@/service/user';
import { notFound } from 'next/navigation';

type Props = {
  params: {
    user: string;
  };
};

export default async function UserPage({ params: { user } }: Props) {
  const userData = await getUserForProfile(user);

  if (!user) notFound();

  return (
    <div className='text-lg'>
      <Hero user={userData} />
      {/* <PostList user={userData}/> */}
    </div>
  );
}

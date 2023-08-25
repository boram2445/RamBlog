import { getUserForProfile } from '@/service/user';
import { notFound } from 'next/navigation';
import PostList from '@/components/posts/PostList';
import Hero from '@/components/user/Hero';

type Props = {
  params: {
    user: string;
  };
};

export default async function UserPage({ params: { user } }: Props) {
  const userData = await getUserForProfile(user);

  if (!user) notFound();

  return (
    <>
      <Hero user={userData} />
      <PostList user={userData} />
    </>
  );
}

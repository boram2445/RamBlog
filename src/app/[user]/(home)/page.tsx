import PostList from '@/components/posts/PostList';
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
    <>
      <PostList user={userData} />
    </>
  );
}

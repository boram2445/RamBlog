import PostList from '@/components/posts/PostList';
import { getUserForProfile } from '@/service/user';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{
    user: string;
  }>;
};

export default async function UserPage(props: Props) {
  const params = await props.params;

  const {
    user
  } = params;

  const userData = await getUserForProfile(user);

  if (!user) notFound();
  return (
    <>
      <PostList user={userData} />
    </>
  );
}

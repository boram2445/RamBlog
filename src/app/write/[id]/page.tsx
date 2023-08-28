import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import WritePostForm from '@/components/post/WritePostForm';
import { getPostDetail } from '@/service/posts';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

type Props = {
  params: {
    id: string;
  };
};

export const dynamic = 'force-dynamic';

export default async function EditPage({ params: { id } }: Props) {
  const postDetail = await getPostDetail(id);
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    redirect('/auth/signin');
  }

  return (
    <>
      <WritePostForm id={id} postDetail={postDetail} username={user.username} />
    </>
  );
}

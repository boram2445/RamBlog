import PostList from '@/components/post/PostList';
import SeriesSection from '@/components/series/SeriesSection';
import { getUserSeries } from '@/service/series';
import { getUserForProfile } from '@/service/user';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{
    user: string;
  }>;
};

export default async function UserPage(props: Props) {
  const params = await props.params;

  const { user } = params;

  const [userData, seriesList] = await Promise.all([
    getUserForProfile(user),
    getUserSeries(user),
  ]);

  if (!userData) notFound();
  return (
    <>
      {seriesList.length > 0 && (
        <SeriesSection seriesList={seriesList} slug={user} />
      )}
      <h2 className="text-xl font-bold my-4">Posts</h2>
      <PostList user={userData} />
    </>
  );
}

import SeriesCard from '@/components/series/SeriesCard';
import ListTitle from '@/components/ui/ListTitle';
import { getUserSeries } from '@/service/series';
import { getUserForProfile } from '@/service/user';
import { notFound } from 'next/navigation';
import { FaBookOpen } from 'react-icons/fa';

type Props = {
  params: Promise<{ user: string }>;
};

export default async function SeriesListPage(props: Props) {
  const params = await props.params;

  const { user } = params;

  const [userData, seriesList] = await Promise.all([
    getUserForProfile(user),
    getUserSeries(user),
  ]);

  if (!userData) notFound();

  return (
    <section className="mx-auto max-w-3xl laptop:max-w-7xl my-10">
      <ListTitle icon={<FaBookOpen className="-mb-2" />} title={'Series'} />
      {seriesList.length === 0 ? (
        <p className="text-gray-500 dark:text-slate-400">
          아직 시리즈가 없습니다.
        </p>
      ) : (
        <div className="p-4 w-full gap-2 grid md:grid-cols-3 sm:grid-cols-2">
          {seriesList.map((series) => (
            <SeriesCard key={series.id} series={series} slug={user} />
          ))}
        </div>
      )}
    </section>
  );
}

export async function generateMetadata(props: Props) {
  const params = await props.params;

  const { user } = params;

  return {
    title: `${user}님의 시리즈`,
    alternates: {
      canonical: `/${user}/series`,
    },
  };
}

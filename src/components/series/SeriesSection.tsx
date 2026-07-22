import { SeriesListItem } from '@/service/series';
import Link from 'next/link';
import { AiOutlineRight } from 'react-icons/ai';
import SeriesCard from './SeriesCard';

const VISIBLE_COUNT = 4;

type Props = {
  seriesList: SeriesListItem[];
  slug: string;
};

export default function SeriesSection({ seriesList, slug }: Props) {
  return (
    <div className="mb-6">
      <div className="mb-2 flex justify-between">
        <h2 className="text-xl font-bold">Series</h2>
        {seriesList?.length > 3 && (
          <Link
            href={`/${slug}/series`}
            className="text-gray-500 flex items-center gap-1 hover:text-gray-800 dark:text-slate-400 dark:hover:text-slate-200"
          >
            전체 보기
            <AiOutlineRight className="w-3 h-3" />
          </Link>
        )}
      </div>

      <div className="p-4 w-full gap-2 grid lg:grid-cols-3 grid-cols-2">
        {seriesList.slice(0, VISIBLE_COUNT).map((series) => (
          <SeriesCard key={series.id} series={series} slug={slug} />
        ))}
      </div>
    </div>
  );
}

import Link from 'next/link';
import { SeriesListItem } from '@/service/series';
import Image from 'next/image';
import { getRelativeTime } from '@/utils/date';

type Props = {
  series: SeriesListItem;
  slug: string;
};

export default function SeriesCard({ series, slug }: Props) {
  return (
    <Link
      href={`/${slug}/series/${series.id}`}
      className="h-56 flex flex-1 flex-col items-center border border-gray-200 rounded-lg overflow-hidden dark:border-neutral-700"
    >
      <div className="relative w-full h-3/5 bg-gray-100 dark:bg-neutral-800">
        {series.thumbnail && (
          <Image
            src={series.thumbnail}
            alt={series.seriesName}
            width={200}
            height={200}
            unoptimized
            className="w-full h-full object-cover"
          />
        )}
        <span className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
          {series.postCount}편
        </span>
      </div>
      <div className="w-full py-2 px-3 flex text-start flex-col items-start justify-start dark:text-slate-300">
        <p>{series.seriesName}</p>
        <p className="text-gray-600 py-1 text-sm dark:text-slate-400">
          {series.description}
        </p>
        {series.lastUpdated && (
          <p className="text-gray-400 text-xs mt-0.5 dark:text-slate-500">
            마지막 업데이트 · {getRelativeTime(series.lastUpdated)}
          </p>
        )}
      </div>
    </Link>
  );
}

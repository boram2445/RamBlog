import { SeriesDetail } from '@/service/series';
import { getRelativeTime } from '@/utils/date';
import Image from 'next/image';

type Props = {
  series: SeriesDetail;
  thumbnail: string;
};

export default function SeriesTitle({ series, thumbnail }: Props) {
  const postCount = series.posts.length;
  const lastUpdated = series.posts.reduce(
    (max, post) => (post.createdAt > max ? post.createdAt : max),
    ''
  );

  return (
    <header className="mt-6 flex gap-4 items-center p-6 rounded-xl text-white dark:bg-neutral-800">
      <div className="relative shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-white/10">
        {thumbnail && (
          <Image
            src={thumbnail}
            alt={series.seriesName}
            width={80}
            height={80}
            unoptimized
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-gray-500">SERIES</p>
        <h1 className="mt-0.5 text-2xl font-semibold truncate text-gray-700">
          {series.seriesName}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {series.description}
          {` · 총 ${postCount}편`}
          {lastUpdated && ` · 마지막 업데이트 ${getRelativeTime(lastUpdated)}`}
        </p>
      </div>
    </header>
  );
}

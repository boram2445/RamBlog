import Link from 'next/link';
import { SeriesListItem } from '@/service/series';

type Props = {
  series: SeriesListItem;
  slug: string;
};

export default function SeriesCard({ series, slug }: Props) {
  return <Link href={`/${slug}/series/${series.id}`}>{series.seriesName}</Link>;
}

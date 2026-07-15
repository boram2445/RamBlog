import useSWR from 'swr';
import { useSWRConfig } from 'swr';
import { DetailLog, Emotion } from '@/model/log';

export default function useLogDetail(
  slug: string,
  logId: string,
  type: 'all' & Emotion
) {
  const url =
    type === 'all'
      ? `/api/${slug}/logs/log/${logId}`
      : `/api/${slug}/logs/log/${logId}/${type}`;

  const { data: log, isLoading, error } = useSWR<DetailLog>(url);
  const { mutate } = useSWRConfig();

  return { log, isLoading, error };
}

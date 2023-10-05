import useSWR from 'swr';
import { useSWRConfig } from 'swr';
import { DetailLog, Emotion } from '@/service/log';

export default function useLogDetail(
  username: string,
  logId: string,
  type: 'all' & Emotion
) {
  const url =
    type === 'all'
      ? `/api/${username}/logs/log/${logId}`
      : `/api/${username}/logs/log/${logId}/${type}`;

  const { data: log, isLoading, error } = useSWR<DetailLog>(url);
  const { mutate } = useSWRConfig();

  return { log, isLoading, error };
}

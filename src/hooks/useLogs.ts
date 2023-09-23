import useSWR from 'swr';
import { useSWRConfig } from 'swr';
import { Emotion, Log } from '@/service/log';

export default function useLogs(username: string, type: 'all' & Emotion) {
  const url =
    type === 'all' ? `/api/${username}/logs` : `/api/${username}/logs/${type}`;

  const { data: logs, isLoading, error } = useSWR<Log[]>(url);
  const { mutate } = useSWRConfig();

  return { logs, isLoading, error };
}

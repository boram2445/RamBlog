import useSWR from 'swr';
import { useSWRConfig } from 'swr';
import { Emotion, Log } from '@/model/log';

export default function useLogs(slug: string, type: 'all' & Emotion) {
  const url = type === 'all' ? `/api/${slug}/logs` : `/api/${slug}/logs/${type}`;

  const { data: logs, isLoading, error } = useSWR<Log[]>(url);
  const { mutate } = useSWRConfig();

  return { logs, isLoading, error };
}

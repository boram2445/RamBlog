import useSWR from 'swr';
import { useSWRConfig } from 'swr';
import { Log } from '@/service/log';

export default function useLogs(username: string) {
  const {
    data: logs,
    isLoading,
    error,
  } = useSWR<Log[]>(`/api/${username}/logs`);
  const { mutate } = useSWRConfig();

  return { logs, isLoading, error };
}

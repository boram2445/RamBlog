import useSWR from 'swr';
import { AuthUser } from '@/model/user';

export default function useUser(username: string) {
  const { data: user } = useSWR<AuthUser>(`/api/${username}`);
}

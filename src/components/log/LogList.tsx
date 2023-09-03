'use client';

import useLogs from '@/hooks/useLogs';
import LogCard from './LogCard';

type Props = {
  username: string;
};

export default function LogList({ username }: Props) {
  const { logs } = useLogs(username);

  return (
    <ul className='flex flex-col gap-3'>
      {logs?.map((log) => (
        <li key={log.id}>
          <LogCard log={log} />
        </li>
      ))}
    </ul>
  );
}

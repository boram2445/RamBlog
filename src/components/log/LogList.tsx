'use client';

import useLogs from '@/hooks/useLogs';
import LogCard from './LogCard';

type Props = {
  username: string;
};

export default function LogList({ username }: Props) {
  const { logs } = useLogs(username);

  return (
    <ul className='mx-auto py-8 px-4 grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 gap-4'>
      {logs?.map((log) => (
        <li key={log.id}>
          <LogCard log={log} />
        </li>
      ))}
    </ul>
  );
}

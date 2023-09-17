'use client';

import useLogs from '@/hooks/useLogs';
import LogCard from './LogCard';

type Props = {
  username: string;
};

export default function LogList({ username }: Props) {
  const { logs } = useLogs(username);

  return (
    <ul className='mx-auto grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 gap-6'>
      {logs?.map((log) => (
        <li key={log.id}>
          <LogCard log={log} />
        </li>
      ))}
    </ul>
  );
}

'use client';

import useLogs from '@/hooks/useLogs';
import LogCard from './LogCard';

type Props = {
  username: string;
};

export default function LogList({ username }: Props) {
  const { logs } = useLogs(username);

  return (
    <>
      {logs?.length === 0 && (
        <p className='text-center text-gray-700'>아직 등록된 일기가 없어요😥</p>
      )}
      <ul className='mx-auto py-8 px-4 grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 gap-2'>
        {logs?.map((log) => (
          <li key={log.id}>
            <LogCard log={log} />
          </li>
        ))}
      </ul>
    </>
  );
}

'use client';

import LogDetail from '@/components/log/LogDetail';
import ModalContainer from '@/components/ui/ModalContainer';
import { DetailLog } from '@/service/log';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';

type Props = {
  params: {
    user: string;
    id: string;
  };
};

export default function LogDetailPage({ params: { user, id } }: Props) {
  const {
    data: log,
    isLoading,
    error,
  } = useSWR<DetailLog>(`/api/${user}/logs/${id}`);
  const router = useRouter();

  console.log(log);

  return (
    <ModalContainer
      onClose={() => router.push(`/${user}/log`)}
      className='overflow-y-auto bg-white rounded-2xl laptop:w-[700px] laptop:h-[410px] desktop:w-[900px] desktop:h-[650px]'
    >
      {/* {log && (
        <LogDetail
          log={log?.currentLog}
          previousId={log?.previousLog?.id}
          nextId={log?.nextLog?.id}
          onClose={() => router.push(`/${user}/log`)}
        />
      )} */}
    </ModalContainer>
  );
}

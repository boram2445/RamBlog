import { DetailLog, Emotion, Log } from '@/service/log';
import Image from 'next/image';
import EmotionItem from './EmotionItem';
import Button from '../ui/Button';
import Date from '../ui/Date';
import { useState, useTransition } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import PageLoader from '../ui/PageLoader';
import { useSWRConfig } from 'swr';
import UserAvartar from '../common/UserAvartar';
import { AiOutlineHeart } from 'react-icons/ai';
import ArrowButton from '../ui/ArrowButton';
import useLogDetail from '@/hooks/useLogDetail';
import Skeleton from '../ui/Skeleton';

type Props = {
  logId: string;
  username: string;
  thumbnail?: string;
  title: string;
  selectedEmotion: 'all' & Emotion;
  resetSelect: () => void;
  onClose: () => void;
};

export default function LogDetail({
  logId,
  username,
  selectedEmotion,
  resetSelect,
  onClose,
}: Props) {
  const [detailId, setDetailId] = useState(logId);
  const { log } = useLogDetail(username, detailId, selectedEmotion);

  const router = useRouter();
  const { mutate } = useSWRConfig();

  const [isPending, startTransition] = useTransition();
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState('');
  const isMutating = isFetching || isPending;

  const handleDelete = async () => {
    if (confirm('정말로 삭제하시겠습니까?😥')) {
      setIsFetching(true);
      await axios
        .delete(`/api/${username}/logs/log/${logId}`)
        .catch((err) => setError(err.toString()));
      setIsFetching(false);
      startTransition(() => {
        onClose();
        resetSelect();
        mutate(`/api/${username}/logs`);
        router.refresh();
        router.push(`/${username}/log`);
      });
    }
  };

  const handleEdit = () => {
    alert('준비중인 기능입니다😅');
  };

  return (
    <>
      {isMutating && <PageLoader label='삭제중...' />}
      {!log && <LogDetailLoading />}
      {log && (
        <div className='overflow-hidden w-full h-full flex flex-col tablet:flex-row'>
          <div className='w-1/2 h-full bg-neutral-900 flex items-center'>
            <Image
              src={log.currentLog.image ?? ''}
              alt={log.currentLog.title}
              width={300}
              height={200}
              className='w-full object-cover'
            />
          </div>
          <div className='w-1/2 flex flex-col'>
            <div className='flex justify-between p-3 border-b border-gray-200 dark:border-neutral-700'>
              <UserAvartar
                username={username}
                imageUrl={log.currentLog.userImage}
              />
              <div className='flex gap-2'>
                <Button onClick={handleEdit}>수정</Button>
                <Button onClick={handleDelete}>삭제</Button>
              </div>
            </div>
            <div className='grow p-4'>
              <div className='flex gap-3 items-center border border-gray-200 px-3 py-2 rounded-lg dark:border-neutral-700'>
                <EmotionItem
                  label={log.currentLog.emotion}
                  size='small'
                  type='text'
                />
              </div>
              <h2 className='text-xl font-semibold my-3'>
                {log.currentLog.title}
              </h2>
              <p className='whitespace-pre-line text-gray-700 dark:text-slate-300'>
                {log.currentLog.content}
              </p>
            </div>
            <div className='flex justify-between items-center border-t border-gray-200 p-3 dark:border-neutral-700'>
              <div className='flex gap-1'>
                <Date
                  date={log.currentLog.date.toString()}
                  dateType='date'
                  type='small'
                />
                <span className='text-sm text-gray-500'>기록</span>
              </div>
              <AiOutlineHeart size='25' className='hover:opacity-70' />
            </div>
          </div>
          {log.nextLog?.id && (
            <ArrowButton
              className='absolute top-1/2 left-0 ml-4'
              type='left'
              onClick={() => setDetailId(log.nextLog.id)}
            />
          )}
          {log.previousLog?.id && (
            <ArrowButton
              className='absolute top-1/2 right-0 mr-4'
              type='right'
              onClick={() => setDetailId(log.previousLog.id)}
            />
          )}
        </div>
      )}
    </>
  );
}

export function LogDetailLoading() {
  return (
    <div className='w-full h-full flex flex-col tablet:flex-row'>
      <Skeleton className='w-1/2 h-full rounded-none' />
    </div>
  );
}

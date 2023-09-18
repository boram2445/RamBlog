import { Log } from '@/service/log';
import Image from 'next/image';
import EmotionItem from './EmotionItem';
import Button from '../ui/Button';
import Date from '../ui/Date';
import { useState, useTransition } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import PageLoader from '../ui/PageLoader';
import { useSWRConfig } from 'swr';

type Props = {
  log: Log;
  previousId?: string;
  nextId?: string;
  onClose: () => void;
};

export default function LogDetail({ log, onClose }: Props) {
  const { title, content, image, id, date, emotion, username } = log;
  const [isPending, startTransition] = useTransition();
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { mutate } = useSWRConfig();

  const isMutating = isFetching || isPending;

  const handleDelete = async () => {
    if (confirm('정말로 삭제하시겠습니까?😥')) {
      setIsFetching(true);
      await axios
        .delete(`/api/${username}/logs/${id}`)
        .catch((err) => setError(err.toString()));
      setIsFetching(false);
      startTransition(() => {
        onClose();
        mutate(`/api/${username}/logs`);
        router.refresh();
        router.push(`/${username}/log`);
      });
    }
  };

  const handleEdit = () => {};

  return (
    <>
      {isMutating && <PageLoader label='삭제중...' />}
      <div className='p-4 overflow-hidden w-full h-full'>
        <div className='pb-3 flex items-center gap-3 justify-between'>
          <div className='flex gap-3 items-center'>
            <Date date={date.toString()} dateType='date' type='big' />
            <EmotionItem label={emotion} size='small' />
            <span>{emotion}</span>
          </div>
          <div className='flex gap-2 -mt-2'>
            <Button onClick={handleEdit}>수정</Button>
            <Button onClick={handleDelete}>삭제</Button>
          </div>
        </div>
        <div className='flex gap-3'>
          {image && (
            <Image
              src={image}
              alt={title}
              width={300}
              height={200}
              className='w-1/2 h-4/5 object-cover aspect-[4/3] rounded-lg'
            />
          )}
          <div className='w-1/2 flex flex-col gap-3'>
            <h2 className='text-xl font-semibold'>{title}</h2>
            <p className='whitespace-pre-line text-gray-700'>{content}</p>
          </div>
        </div>
      </div>
    </>
  );
}

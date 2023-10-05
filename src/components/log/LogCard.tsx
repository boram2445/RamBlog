import { Emotion, SimpleLog } from '@/model/log';
import Image from 'next/image';
import { useState } from 'react';
import ModalContainer from '../ui/ModalContainer';
import LogDetail from './LogDetail';
import EmotionItem from './EmotionItem';
import { getDate } from '@/utils/date';
import Skeleton from '../ui/Skeleton';

type Props = {
  log: SimpleLog;
  selectedEmotion: 'all' & Emotion;
  resetSelect: () => void;
};

export default function LogCard({ log, selectedEmotion, resetSelect }: Props) {
  const { title, image, id, username, emotion, date } = log;
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <div
        onClick={() => setOpenModal(true)}
        className='group relative w-full aspect-square cursor-pointer shadow-sm'
      >
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            sizes='400px'
            className='object-cover'
          />
        ) : (
          <div className='bg-gray-50 w-full h-full'></div>
        )}

        <div className='absolute top-3 right-3 p-2 bg-white bg-opacity-90 rounded-full'>
          <EmotionItem label={emotion} />
        </div>
        <div className='hidden group-hover:flex flex-col items-center justify-center absolute inset-0 bg-black bg-opacity-40 text-white '>
          <h2 className='text-xl font-semibold mb-3'>{title}</h2>
          <small>{getDate(date.toString(), 'date')}</small>
        </div>
      </div>
      {openModal && (
        <ModalContainer
          onClose={() => setOpenModal(false)}
          className='overflow-y-auto bg-white w-4/5 laptop:h-[480px] desktop:max-w-[1000px] desktop:h-[580px] dark:bg-neutral-800'
        >
          <LogDetail
            logId={id}
            username={username}
            thumbnail={image}
            title={title}
            selectedEmotion={selectedEmotion}
            resetSelect={resetSelect}
            onClose={() => setOpenModal(false)}
          />
        </ModalContainer>
      )}
    </>
  );
}

export function LogCardLoading() {
  return <Skeleton className='w-full aspect-square' />;
}

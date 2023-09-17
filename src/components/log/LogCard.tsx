import { Log } from '@/service/log';
import Date from '../ui/Date';
import Image from 'next/image';
import EmotionItem from './EmotionItem';
import { useState } from 'react';
import ModalContainer from '../ui/ModalContainer';

type Props = {
  log: Log;
};

export default function LogCard({ log }: Props) {
  const { title, content, image, id, date, emotion } = log;
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <div
        onClick={() => setOpenModal(true)}
        className='relative w-full h-full flex flex-col justify-between shadow-md rounded-lg overflow-hidden hover:brightness-90 cursor-pointer'
      >
        {image ? (
          <Image
            src={image}
            alt={title}
            width={300}
            height={200}
            className='w-full  h-4/5 object-cover aspect-square'
          />
        ) : (
          <div className='w-full h-4/5 bg-indigo-100'></div>
        )}
        <div className='absolute top-3/4 right-1 bg-white px-2 py-1 rounded-full'>
          <Date date={date.toString()} dateType='date' />
        </div>
        <div className='h-1/5 px-3 flex gap-2 items-center text-gray-600'>
          <EmotionItem label={emotion} />
          <h2 className='w-5/6 truncate'>{title}</h2>
        </div>
      </div>
      {openModal && (
        <ModalContainer
          onClose={() => setOpenModal(false)}
          className='overflow-y-auto bg-white rounded-2xl w-full max-w-[650px] tablet:w-3/4 min-h-[300px] tablet:h-3/4'
        >
          {content}
        </ModalContainer>
      )}
    </>
  );
}

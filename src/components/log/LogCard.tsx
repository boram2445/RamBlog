import { Log } from '@/service/log';
import Date from '../ui/Date';
import Image from 'next/image';
import EmotionItem from './EmotionItem';
import { useState } from 'react';
import ModalContainer from '../ui/ModalContainer';
import LogDetail from './LogDetail';
import FlipHover from '../ui/FlipHover';

type Props = {
  log: Log;
};

export default function LogCard({ log }: Props) {
  const { title, content, image, id, date, emotion } = log;
  const [openModal, setOpenModal] = useState(false);

  const front = (
    <div className='relative w-full aspect-square'>
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
    </div>
  );

  const back = (
    <div className='flex flex-col gap-2 items-center justify-center text-gray-600'>
      <Date date={date.toString()} dateType='date' />
      <EmotionItem label={emotion} />
      <h2>{title}</h2>
    </div>
  );

  return (
    <>
      <div onClick={() => setOpenModal(true)} className='hover:brightness-95'>
        <FlipHover front={front} back={back} />
      </div>
      {openModal && (
        <ModalContainer
          onClose={() => setOpenModal(false)}
          className='overflow-y-auto bg-white rounded-2xl laptop:w-[700px] laptop:h-[410px] desktop:w-[900px] desktop:h-[650px]'
        >
          <LogDetail log={log} />
        </ModalContainer>
      )}
    </>
  );
}

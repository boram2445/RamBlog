import { Log } from '@/service/log';
import Image from 'next/image';
import { useState } from 'react';
import ModalContainer from '../ui/ModalContainer';
import LogDetail from './LogDetail';
import { AiFillHeart } from 'react-icons/ai';

type Props = {
  log: Log;
};

export default function LogCard({ log }: Props) {
  const { title, image } = log;
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <div
        onClick={() => setOpenModal(true)}
        className='group relative w-full aspect-square cursor-pointer'
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
        <div className='hidden group-hover:flex items-center justify-center absolute inset-0 bg-black bg-opacity-20'>
          <div className=''>
            <AiFillHeart size='25' color='white' />
          </div>
        </div>
      </div>
      {openModal && (
        <ModalContainer
          onClose={() => setOpenModal(false)}
          className='overflow-y-auto bg-white rounded-2xl laptop:w-[700px] laptop:h-[410px] desktop:w-[900px] desktop:h-[650px]'
        >
          <LogDetail log={log} onClose={() => setOpenModal(false)} />
        </ModalContainer>
      )}
    </>
  );
}

import { Log } from '@/service/log';
import Image from 'next/image';
import EmotionItem from './EmotionItem';
import Button from '../ui/Button';
import Date from '../ui/Date';

type Props = {
  log: Log;
};

export default function LogDetail({ log }: Props) {
  const { title, content, image, id, date, emotion } = log;

  return (
    <div className='p-4 overflow-hidden w-full h-full'>
      <div className='pb-3 flex items-center gap-3 justify-between'>
        <div className='flex gap-3 items-center'>
          <Date date={date.toString()} dateType='date' type='big' />
          <EmotionItem label={emotion} size='small' />
          <span>{emotion}</span>
        </div>
        <div className='flex gap-2 -mt-2'>
          <Button>수정</Button>
          <Button>삭제</Button>
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
          <div className='relative'>
            {/* <Image
              alt='컨텐츠'
              src={StickyNote}
              width={400}
              className='-mt-2 absolute w-full object-cover aspect-square'
            /> */}
            <div className='absolute w-full'>
              <h2 className='text-xl font-semibold'>{title}</h2>
              <p className='whitespace-pre-line text-gray-700'>{content}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

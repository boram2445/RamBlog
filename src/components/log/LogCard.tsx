import { Log } from '@/service/log';
import Date from '../ui/Date';
import Image from 'next/image';

type Props = {
  log: Log;
};

export default function LogCard({ log }: Props) {
  const { title, content, image, id, createdAt } = log;

  return (
    <div className='min-h-[200px] flex justify-between border-b border-gray-200 py-2 px-6'>
      <div>
        <h1 className='text-2xl mb-1'>{title}</h1>
        <Date date={createdAt.toString()} />
        <p className='my-4 whitespace-pre text-gray-700'>{content}</p>
      </div>
      {image && (
        <Image
          src={image}
          alt={title}
          width={200}
          height={200}
          className='object-cover aspect-square'
        />
      )}
    </div>
  );
}

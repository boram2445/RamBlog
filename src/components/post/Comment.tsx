'use client';

import { Comment } from '@/service/posts';
import Avartar from '../ui/Avartar';
import { useRouter } from 'next/navigation';

type Props = {
  comment: Comment;
};

export default function Comment({ comment }: Props) {
  const { image, username, comment: text, createdAt, type } = comment;
  const router = useRouter();

  return (
    <div className=' p-4 bg-gray-50 rounded-lg'>
      <div className='mb-2 flex items-center gap-4'>
        <Avartar imageUrl={image} username={username} type='big' />
        <div className='flex flex-col gap-1'>
          <span
            className={`text-semibold ${
              type === 'loggedInUserComment' && 'hover:underline cursor-pointer'
            }`}
            onClick={() => router.push(`/${username}`)}
          >
            {username}
          </span>
          <time className='text-sm text-gray-400'>{createdAt.toString()}</time>
        </div>
      </div>
      <p className='ml-2 pt-3 pb-4'>{text}</p>
    </div>
  );
}

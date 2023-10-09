'use client';

import { useRouter } from 'next/navigation';
import TagList from '../common/TagList';
import Date from '../ui/Date';
import Image from 'next/image';
import { AiOutlineRight } from 'react-icons/ai';
import { SimplePost } from '@/model/post';
import Skeleton from '../ui/Skeleton';
import LikeNumIcon from '../common/LikeNumIcon';

export default function PostListCard({ post }: { post: SimplePost }) {
  const {
    title,
    description,
    tags,
    id,
    mainImage,
    createdAt,
    username,
    likes,
  } = post;

  const router = useRouter();
  const handleClick = () => router.push(`/${username}/posts/${id}`);

  return (
    <article className='group p-6 flex gap-4 justify-between border-b border-gray-200 cursor-pointer animate-fade-in dark:border-neutral-700 overflow-hidden'>
      <div className='flex flex-col min-h-[160px]'>
        <TagList tags={tags} />
        <div className='flex flex-col h-full' onClick={handleClick}>
          <div className='mt-1 py-1 text-gray-900 text-lg tablet:text-2xl flex gap-2 items-center group-hover:text-indigo-500 dark:group-hover:text-slate-100 dark:text-slate-300'>
            <AiOutlineRight className='hidden group-hover:block w-4 animate-fade-in-left' />
            <h1 className='line-clamp-1 w-11/12'>{title}</h1>
          </div>
          <div className='mt-1 grow'>
            <p className=' text-gray-400 line-clamp-2'>{description}</p>
          </div>
          <div className='flex gap-2 items-center'>
            <Date date={createdAt?.toString()} />
            <LikeNumIcon likes={likes} className='text-gray-700' />
          </div>
        </div>
      </div>
      {mainImage && (
        <Image
          src={mainImage}
          alt={`${title}이미지`}
          width={160}
          height={160}
          className='object-cover aspect-square'
          onClick={handleClick}
        />
      )}
    </article>
  );
}

export function PostListCardLoading() {
  return (
    <div className='p-6 flex justify-between border-b border-gray-200 dark:border-neutral-700'>
      <div className='grow flex flex-col gap-2'>
        <Skeleton className='w-[3rem] h-[1.25rem]' />
        <Skeleton className='w-2/3 h-[2rem]' />
        <Skeleton className='w-5/6 h-[1.25rem] mt-2' />
        <Skeleton className='w-1/2 h-[1.25rem]' />
      </div>
      <Skeleton className='w-[160px] h-[160px] object-cover' />
    </div>
  );
}

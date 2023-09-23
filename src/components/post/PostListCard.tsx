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

  return (
    <article
      onClick={() => router.push(`/${username}/posts/${id}`)}
      className='group p-6 flex justify-between border-b border-gray-200 cursor-pointer animate-fade-in dark:border-neutral-700'
    >
      <div className='flex flex-col'>
        <TagList tags={tags} />
        <h1 className='mt-1 py-1 text-gray-900 text-lg tablet:text-2xl flex gap-2 items-center group-hover:text-indigo-500 dark:group-hover:text-slate-100 dark:text-slate-300'>
          <AiOutlineRight className='hidden group-hover:block w-4  animate-fade-in-left' />
          {title}
        </h1>
        <p className='mt-1 h-10 tablet:h-12 text-gray-400 truncate'>
          {description}
        </p>
        <div className='flex gap-2 items-center'>
          <Date date={createdAt?.toString()} />
          <LikeNumIcon likes={likes} className='text-gray-700' />
        </div>
      </div>
      {mainImage && (
        <Image
          src={mainImage}
          alt={`${title}이미지`}
          width={180}
          height={180}
          className='object-cover'
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
      <Skeleton className='w-[180px] h-[160px] object-cover' />
    </div>
  );
}

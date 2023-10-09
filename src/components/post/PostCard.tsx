'use client';

import Image from 'next/image';
import TagList from '../common/TagList';
import Date from '../ui/Date';
import UserAvartar, { UserAvartarLoading } from '../common/UserAvartar';
import { useRouter } from 'next/navigation';
import { SimplePost } from '@/model/post';
import Skeleton from '../ui/Skeleton';
import LikeNumIcon from '../common/LikeNumIcon';

export default function PostCard({ post }: { post: SimplePost }) {
  const {
    title,
    description,
    tags,
    id,
    mainImage,
    createdAt,
    username,
    userImage,
    likes,
  } = post;

  const router = useRouter();
  const handleClick = () => router.push(`/${username}/posts/${id}`);

  return (
    <article className='relative mx-auto w-full h-[352px] tablet:h-76 overflow-hidden shadow-md rounded-lg animate-fade-in hover:-translate-y-3  transition-transform ease-in-out duration-300 dark:bg-neutral-800'>
      {mainImage && (
        <Image
          src={mainImage}
          alt={`${title}이미지`}
          width={300}
          height={200}
          className='mx-auto w-full h-1/2 object-cover aspect-square cursor-pointer'
          priority
          onClick={handleClick}
        />
      )}
      <div className={`${mainImage ? 'h-1/2' : 'h-full'} flex flex-col`}>
        <div className='grow px-3 py-2 flex flex-col'>
          <TagList tags={tags} />
          <div
            className='grow flex flex-col cursor-pointer'
            onClick={handleClick}
          >
            <h2 className='py-1 text-gray-900 font-semibold dark:text-slate-300 break-all line-clamp-2'>
              {title}
            </h2>
            <p
              className={`text-sm text-gray-600 dark:text-slate-400 break-all ${
                mainImage ? 'line-clamp-1' : 'line-clamp-5'
              }`}
            >
              {description}
            </p>
          </div>
          <div className='flex justify-end'>
            <Date date={createdAt?.toString()} dateType='date' type='xsmall' />
          </div>
        </div>
        <div className='p-2 flex justify-between border-t border-gray-100 dark:border-neutral-700'>
          <UserAvartar username={username} imageUrl={userImage} />
          <LikeNumIcon likes={likes} className='mr-2 dark:text-slate-500' />
        </div>
      </div>
    </article>
  );
}

export function PostCardLoading() {
  return (
    <div className='relative mx-auto w-full h-[350px] tablet:h-76 shadow-md rounded-lg dark:border dark:border-neutral-800'>
      <Skeleton className='mx-auto w-full h-1/2 object-cover aspect-square' />
      <div className='h-1/2 flex flex-col'>
        <div className='grow flex flex-col gap-2 p-2'>
          <Skeleton className='w-full h-[1.25rem]' />
          <Skeleton className='w-5/6 h-[1.25rem]' />
        </div>
        <div className='p-2 flex justify-between items-center border-t border-gray-100 dark:border-neutral-700'>
          <UserAvartarLoading size='small' />
          <Skeleton className='w-[4rem] h-[1.25rem]' />
        </div>
      </div>
    </div>
  );
}

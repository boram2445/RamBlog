'use client';

import Image from 'next/image';
import TagList from '../common/TagList';
import Date from '../ui/Date';
import UserAvartar, { UserAvartarLoading } from '../common/UserAvartar';
import { useRouter } from 'next/navigation';
import { Post } from '@/model/post';
import Skeleton from '../ui/Skeleton';

export default function PostCard({ post }: { post: Post }) {
  const {
    title,
    description,
    tags,
    id,
    mainImage,
    createdAt,
    username,
    userImage,
  } = post;

  const router = useRouter();

  return (
    <article
      onClick={() => router.push(`/${username}/posts/${id}`)}
      className='relative mx-auto w-full h-[350px] tablet:h-76 overflow-hidden shadow-md rounded-lg cursor-pointer animate-fade-in hover:-translate-y-3  transition-transform ease-in-out duration-300'
    >
      {mainImage && (
        <Image
          src={mainImage}
          alt={`${title}이미지`}
          width={200}
          height={200}
          className='mx-auto w-full h-1/2 object-cover aspect-square'
        />
      )}
      <div className={`${mainImage ? 'h-1/2' : 'h-full'} flex flex-col`}>
        <div className='grow p-3'>
          <TagList tags={tags} />
          <h3 className='py-1 text-black font-semibold'>{title}</h3>
          <p className='mt-1 w-full text-xs text-gray-600 truncate'>
            {description}
          </p>
        </div>
        <div className='p-2 flex justify-between border-t border-gray-100'>
          <UserAvartar username={username} imageUrl={userImage} />
          <Date date={createdAt?.toString()} dateType='date' />
        </div>
      </div>
    </article>
  );
}

export function PostCardLoading() {
  return (
    <div className='relative mx-auto w-full h-[350px] tablet:h-76 shadow-md rounded-t-lg'>
      <Skeleton className='mx-auto w-full h-1/2 object-cover aspect-square' />
      <div className='h-1/2 flex flex-col'>
        <div className='grow flex flex-col gap-2 p-2'>
          <Skeleton className='w-full h-[1.25rem]' />
          <Skeleton className='w-5/6 h-[1.25rem]' />
        </div>
        <div className='p-2 flex justify-between items-center border-t border-gray-100'>
          <UserAvartarLoading size='small' />
          <Skeleton className='w-[5rem] h-[1.25rem]' />
        </div>
      </div>
    </div>
  );
}

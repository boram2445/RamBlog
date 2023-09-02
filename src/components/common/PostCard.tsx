'use client';

import Image from 'next/image';
import { Post } from '@/service/posts';
import TagList from './TagList';
import Date from '../ui/Date';
import UserAvartar from './UserAvartar';
import { useRouter } from 'next/navigation';

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
      className='relative mx-auto w-full h-[350px] tablet:h-76 overflow-hidden border-2 border-gray-200 rounded-lg cursor-pointer  hover:drop-shadow-md'
    >
      {mainImage && (
        <Image
          src={mainImage}
          alt={`${title}이미지`}
          width={200}
          height={200}
          className='mx-auto w-full h-1/2 object-cover'
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
          <Date date={createdAt?.toString()} />
        </div>
      </div>
    </article>
  );
}

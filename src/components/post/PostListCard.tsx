'use client';

import { useRouter } from 'next/navigation';
import TagList from '../common/TagList';
import Date from '../ui/Date';
import Image from 'next/image';
import { AiOutlineRight } from 'react-icons/ai';
import { Post } from '@/model/post';

export default function PostListCard({ post }: { post: Post }) {
  const { title, description, tags, id, mainImage, createdAt, username } = post;

  const router = useRouter();

  return (
    <article
      onClick={() => router.push(`/${username}/posts/${id}`)}
      className='group p-6 flex justify-between border-b border-gray-200 cursor-pointer animate-fade-in'
    >
      <div className='flex flex-col'>
        <TagList tags={tags} />
        <h1 className='mt-1 py-1 text-black text-lg tablet:text-2xl flex gap-2 items-center group-hover:text-indigo-500'>
          <AiOutlineRight className='hidden group-hover:block w-4  animate-fade-in-left' />
          {title}
        </h1>
        <p className='mt-1 h-10 tablet:h-12 text-gray-400 truncate'>
          {description}
        </p>
        <Date date={createdAt?.toString()} />
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

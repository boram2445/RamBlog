import { Post } from '@/service/posts';
import Image from 'next/image';
import Link from 'next/link';
import { BsArrowLeftCircleFill, BsArrowRightCircleFill } from 'react-icons/bs';

type Props = {
  data: Post;
  type: 'prev' | 'next';
};

const ICON_CLASS = 'text-3xl group-hover:text-4xl transition-all';

export default function AdjacentPostCard({ data, type }: Props) {
  const { title, id, username } = data;

  return (
    <Link
      href={`/${username}/posts/${id}`}
      className='w-full h-20 flex items-center cursor-pointer hover:shadow-lg bg-gray-50'
    >
      <div
        className={`group w-full px-5 flex items-center gap-4 ${
          type === 'next' ? 'justify-end' : ''
        }`}
      >
        {type === 'prev' && <BsArrowLeftCircleFill className={ICON_CLASS} />}
        <div className={`${type === 'next' ? 'text-end' : ''}`}>
          <small>{type === 'prev' ? '이전 포스트' : '다음 포스트'}</small>
          <h4 className='text-xl font-semibold'>{title}</h4>
        </div>
        {type === 'next' && <BsArrowRightCircleFill className={ICON_CLASS} />}
      </div>
    </Link>
  );
}

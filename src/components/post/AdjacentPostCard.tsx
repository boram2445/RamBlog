import Link from 'next/link';
import { BsArrowLeftCircleFill, BsArrowRightCircleFill } from 'react-icons/bs';

type Props = {
  data: { username: string; title: string; id: string };
  type: 'prev' | 'next';
};

const ICON_CLASS = 'text-3xl group-hover:text-4xl transition-all';

export default function AdjacentPostCard({ data, type }: Props) {
  const { title, id, username } = data;

  return (
    <Link
      href={`/${username}/posts/${id}`}
      className='w-full h-20 flex items-center cursor-pointer hover:shadow-lg bg-gray-50 dark:bg-neutral-800'
    >
      <div
        className={`group w-full px-5 flex items-center gap-4 ${
          type === 'next' ? 'justify-end' : ''
        }`}
      >
        {type === 'prev' && <BsArrowLeftCircleFill className={ICON_CLASS} />}
        <div className={`w-5/6 ${type === 'next' ? 'text-end' : ''}`}>
          <small>{type === 'prev' ? '이전 포스트' : '다음 포스트'}</small>
          <h2 className='text-xl font-semibold line-clamp-1'>{title}</h2>
        </div>
        {type === 'next' && <BsArrowRightCircleFill className={ICON_CLASS} />}
      </div>
    </Link>
  );
}

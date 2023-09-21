'use client';

import { useRouter } from 'next/navigation';
import Skeleton from '../ui/Skeleton';

type Props = {
  tags: string[] | { name: string; count: number }[];
  type?: 'small' | 'big';
  onClick?: (tag: string) => void;
  checked?: string;
};

export default function TagList({
  tags,
  type = 'small',
  onClick,
  checked,
}: Props) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) =>
    e.stopPropagation();

  return (
    <ul className='flex gap-x-2 gap-y-4 flex-wrap '>
      {tags?.map((tag, index) => (
        <li key={index}>
          <button
            type='button'
            onClick={
              onClick
                ? () => onClick(getTagName(tag))
                : (e: React.MouseEvent<HTMLButtonElement>) => {
                    handleClick(e);
                    router.push(`/tags/${tag}`);
                  }
            }
            className={`py-0.5 border border-gray-200 rounded-full hover:bg-gray-200 cursor-pointer ${
              type === 'small' ? 'text-xs px-2' : 'text-base px-3'
            } ${checked === getTagName(tag) ? 'bg-gray-200' : ''}`}
          >
            {getTagName(tag)}
            {typeof tag !== 'string' && ` ${tag.count}`}
          </button>
        </li>
      ))}
    </ul>
  );
}

export function TagListLoading({ type = 'small' }: { type?: 'small' | 'big' }) {
  return (
    <ul className='flex gap-2'>
      {Array.from({ length: 2 }, (_, index) => (
        <Skeleton
          className={`${
            type === 'small' ? 'w-[3rem] h-[1.25rem]' : 'w-[4rem] h-[1.5rem]'
          }`}
          key={index}
        />
      ))}
    </ul>
  );
}

function getTagName(tag: string | { name: string; count: number }) {
  return typeof tag === 'string' ? tag : tag.name;
}

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

  return (
    <ul className='flex gap-2'>
      {tags?.map((tag, index) => (
        <li key={index}>
          <span
            onClick={onClick ? () => onClick(getTagName(tag)) : () => {}}
            className={`py-0.5 border border-gray-200 rounded-full hover:bg-gray-200 cursor-pointer ${
              type === 'small' ? 'text-xs px-2' : 'text-base px-3'
            } ${checked === getTagName(tag) ? 'bg-gray-200' : ''}`}
          >
            {getTagName(tag)}
            {typeof tag !== 'string' && ` ${tag.count}`}
          </span>
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
            type === 'small' ? 'w-[3rem] h-[1.25rem]' : 'w-[4rem] h-[1.25rem]'
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

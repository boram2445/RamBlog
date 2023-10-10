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
    <ul className='flex gap-2 tablet:gap-x-2 tablet:gap-y-4 flex-wrap items-center'>
      {tags?.map((tag, index) => (
        <li key={index}>
          <button
            type='button'
            onClick={
              onClick
                ? () => onClick(getTagName(tag))
                : () => router.push(`/tags/${tag}`)
            }
            className={`py-[1px] border border-gray-200 rounded-full flex items-center gap-1 hover:bg-gray-200 cursor-pointer dark:text-slate-300 dark:bg-neutral-700 dark:border-neutral-700 dark:hover:bg-neutral-600 dark:hover:text-slate-200 ${
              type === 'small' ? 'text-xs px-2' : 'text-base px-3'
            } ${checked === getTagName(tag) ? 'bg-gray-200' : ''}`}
          >
            {getTagName(tag)}
            {typeof tag !== 'string' && (
              <span className='text-sm text-indigo-600 dark:text-indigo-100'>{`${tag.count}`}</span>
            )}
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

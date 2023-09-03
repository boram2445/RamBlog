'use client';

import { useRouter } from 'next/navigation';

type Props = {
  tags: string[];
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
            onClick={onClick ? () => onClick(tag) : () => {}}
            className={`py-0.5 border border-gray-200 rounded-full hover:bg-gray-200 cursor-pointer ${
              type === 'small' ? 'text-xs px-2' : 'text-base px-3'
            } ${checked === tag ? 'bg-gray-200' : ''}`}
          >
            {tag}
          </span>
        </li>
      ))}
    </ul>
  );
}

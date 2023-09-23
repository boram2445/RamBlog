'use client';

import { ProfileUser } from '@/model/user';
import { useRouter } from 'next/navigation';

type Props = {
  user: ProfileUser;
};

export default function FollowNumButtons({ user }: Props) {
  const router = useRouter();

  const info = [
    { number: user.followers, label: '팔로워', name: 'follower' },
    { number: user.following, label: '팔로잉', name: 'following' },
  ];

  return (
    <ul className='flex gap-2'>
      {info.map(({ number, label, name }, index) => (
        <li
          key={index}
          className='py-1 px-3 flex gap-2 rounded-full hover:bg-gray-50 cursor-pointer text-gray-700 dark:text-slate-300 dark:hover:bg-neutral-800'
          onClick={() => router.push(`/${user.username}/${name}`)}
        >
          {label}
          <span className='font-semibold mr-1'>{number}</span>
        </li>
      ))}
    </ul>
  );
}

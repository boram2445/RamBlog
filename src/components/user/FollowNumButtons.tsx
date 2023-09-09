'use client';

import { ProfileUser } from '@/model/user';

type Props = {
  user: ProfileUser;
};

export default function FollowNumButtons({ user }: Props) {
  const info = [
    { number: user.followers, label: '팔로워' },
    { number: user.following, label: '팔로잉' },
  ];

  return (
    <ul className='flex gap-2'>
      {info.map(({ number, label }, index) => (
        <li
          key={index}
          className='py-1 px-2 flex gap-2 rounded-full hover:bg-gray-50 cursor-pointer text-gray-700'
        >
          {label}
          <span className='font-semibold mr-1'>{number}</span>
        </li>
      ))}
    </ul>
  );
}

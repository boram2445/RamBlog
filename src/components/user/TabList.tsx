'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeUser } from '@/model/user';

type Props = {
  user: HomeUser;
};

const tabStyle = `px-16 py-4 cursor-pointer text-gray-600 border-b-2 border-gray-200 hover:text-gray-900`;
const tabs = [
  { href: '/about', name: 'About' },
  { href: '', name: 'Posts' },
  { href: '/log', name: 'Log' },
];

export default function TabList({ user }: Props) {
  const pathname = usePathname();

  return (
    <ul className='flex justify-center'>
      {tabs.map(({ href, name }) => (
        <li key={href}>
          <Link
            href={`/${user.username}${href}`}
            className={`${tabStyle} ${
              pathname.split(`/${user.username}`)[1] === href
                ? 'border-gray-700 font-semibold text-gray-900'
                : ''
            }`}
          >
            {name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
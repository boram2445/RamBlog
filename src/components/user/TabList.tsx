'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ProfileUser } from '@/model/user';

type Props = {
  user: ProfileUser;
};

const tabStyle =
  'px-5 py-1.5 cursor-pointer text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-300';

const tabs = [
  { href: '', name: 'Posts' },
  { href: '/log', name: 'Log' },
  { href: '/about', name: 'About' },
];

export default function TabList({ user }: Props) {
  const pathname = usePathname();

  return (
    <ul className='mt-3 pt-3 pb-5 flex border-b border-gray-200 dark:border-neutral-500'>
      {tabs.map(({ href, name }) => (
        <li key={href}>
          <Link
            href={`/${user.username}${href}`}
            className={`${tabStyle} ${
              getOnPath(pathname, href, user.username)
                ? 'font-semibold text-gray-900 bg-gray-100 rounded-full dark:text-gray-700'
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

function getOnPath(url: string, href: string, username: string) {
  const path = url.split(`/${username}`)[1];
  if (href === '' && path === '') return true;
  else if (href === '/about' && path.includes(href)) return true;
  else if (href === '/log' && path.includes(href)) return true;
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ProfileUser } from '@/model/user';

type Props = {
  user: ProfileUser;
};

const tabStyle = `px-16 py-3 cursor-pointer text-gray-600 border-b-2 border-gray-200 hover:text-gray-900`;
const tabs = [
  { href: '/about', name: 'About' },
  { href: '', name: 'Posts' },
  { href: '/log', name: 'Log' },
];

export default function TabList({ user }: Props) {
  const pathname = usePathname();

  return (
    <ul className='mt-3 mb-6 flex justify-center'>
      {tabs.map(({ href, name }) => (
        <li key={href}>
          <Link
            href={`/${user.username}${href}`}
            className={`${tabStyle} ${
              getOnPath(pathname, href, user.username)
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

function getOnPath(url: string, href: string, username: string) {
  const path = url.split(`/${username}`)[1];
  if (href === '' && path === '') return true;
  else if (href === '/about' && path.includes(href)) return true;
  else if (href === '/log' && path.includes(href)) return true;
}

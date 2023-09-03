'use client';

import Link from 'next/link';
import logo from '../../asset/icons/logo.svg';
import Image from 'next/image';
import { signIn, signOut, useSession } from 'next-auth/react';
import Button from '../ui/Button';
import { usePathname } from 'next/navigation';
import UserAvartar from './UserAvartar';

export default function Header() {
  const { data: session } = useSession();
  const user = session?.user;
  const pathname = usePathname();

  const isMyPage =
    user && (pathname.includes('/write') || pathname.includes(user.username));
  const isWritePage = user && pathname.includes('/write');

  return (
    <header>
      <div className='max-w-screen-lg mx-auto px-5 py-4 flex justify-between items-center'>
        <Link href='/' className='text-xl cursor-pointer'>
          <Image src={logo} alt='RAMBLOG 로고' width={120} />
        </Link>
        <nav className='flex items-center gap-x-5 mr-4'>
          {user && (
            <Link
              href={`${isMyPage ? '/' : `/${user.username}`}`}
              prefetch={false}
              className='hover:text-blue-600'
            >
              {isMyPage ? 'All Posts' : 'My Blog'}
            </Link>
          )}
          {user && (
            <Link
              href='/write'
              prefetch={false}
              className={`hover:text-blue-600 ${
                isWritePage && 'text-blue-600'
              }`}
            >
              Add Post
            </Link>
          )}
          {/* <div>
            <Link href='https://github.com/boram2445' target='_blank'>
              <BsGithub className='cursor-pointer text-2xl text-bronze' />
            </Link>
          </div> */}
          {user && (
            <UserAvartar
              imageUrl={user.image}
              username={user.username}
              type={'medium'}
            />
          )}
          <Button onClick={session ? signOut : signIn}>
            {session ? 'Sign Out' : 'Sign In'}
          </Button>
        </nav>
      </div>
    </header>
  );
}

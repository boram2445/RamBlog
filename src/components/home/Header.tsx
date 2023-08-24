'use client';

import Link from 'next/link';
import logo from '../../asset/icons/logo.svg';
import { BsGithub } from 'react-icons/bs';
import Image from 'next/image';
import { signIn, signOut, useSession } from 'next-auth/react';
import Button from '../ui/Button';
import { useRouter, usePathname } from 'next/navigation';

export default function Header() {
  const { data: session } = useSession();
  const user = session?.user;

  const router = useRouter();
  const pathname = usePathname();

  return (
    <header>
      <div className='max-w-screen-lg mx-auto px-5 py-4 flex justify-between items-center'>
        <Link href='/' className='text-xl cursor-pointer'>
          <Image src={logo} alt='RAMBLOG 로고' width={120} />
        </Link>
        <div className='flex gap-x-5 mr-4'>
          {user && (
            <nav className='flex gap-x-4 items-center'>
              <Link
                href={`/${user.username}/about`}
                className='cursor-pointer text-sm font-medium text-black-gray'
              >
                ABOUT
              </Link>
              <Link
                href={`/${user.username}/posts`}
                className='cursor-pointer text-sm font-medium text-black-gray'
              >
                POSTS
              </Link>
              <Link
                href='/write'
                className='cursor-pointer text-sm font-medium text-black-gray'
              >
                NEW
              </Link>
            </nav>
          )}

          {/* <div>
            <Link href='https://github.com/boram2445' target='_blank'>
              <BsGithub className='cursor-pointer text-2xl text-bronze' />
            </Link>
          </div> */}
          {user && (
            <>
              <div>
                {/* eslint-disable-next-line @next/next/no-img-element*/}
                <img src={user.image || ''} alt={user.username} />
                <p>{user.username}</p>
              </div>
              <Button
                onClick={() =>
                  router.push(
                    `${
                      pathname.includes(user.username)
                        ? '/'
                        : `${user.username}`
                    }`
                  )
                }
              >
                {pathname.includes(user.username) ? '전체 포스트' : '내 블로그'}
              </Button>
            </>
          )}
          <Button onClick={session ? signOut : signIn}>
            {session ? 'Sign Out' : 'Sign In'}
          </Button>
        </div>
      </div>
    </header>
  );
}
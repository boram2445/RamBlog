'use client';

import Link from 'next/link';
import useSWR from 'swr';
import logo from '../../asset/icons/logo.svg';
import Image from 'next/image';
import { signIn, signOut, useSession } from 'next-auth/react';
import Button from '../ui/Button';
import { usePathname, useRouter } from 'next/navigation';
import UserAvartar from './UserAvartar';
import { useRef, useState } from 'react';
import DropDownNav from './DropDownNav';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import { UserData } from '@/model/user';

export default function Header() {
  const { data: session } = useSession();
  const user = session?.user;

  const { data: loginUser } = useSWR<UserData>(
    user ? `/api/${user.username}/me` : null
  );

  console.log(loginUser);

  const pathname = usePathname();

  const [isOpenNav, setIsOpenNav] = useState(false);
  const btnRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  const router = useRouter();
  const navList = [
    {
      label: '프로필 설정',
      onClick: () => router.push(`/${user?.username}/me/setting`),
    },
    { label: '로그아웃', onClick: signOut },
  ];

  const isMyPage =
    user && (pathname.includes('/write') || pathname.includes(user.username));
  const isWritePage = user && pathname.includes('/write');

  return (
    <header>
      <div className='max-w-screen-lg mx-auto px-5 py-3 flex justify-between items-center'>
        <Link href='/' className='text-xl cursor-pointer'>
          <Image src={logo} alt='RAMBLOG 로고' width={120} />
        </Link>
        <nav className='flex items-center gap-x-5 mr-4'>
          {loginUser && (
            <>
              <Link
                href={`${isMyPage ? '/' : `/${loginUser.username}`}`}
                prefetch={false}
                className='hover:text-blue-600'
              >
                {isMyPage ? 'All Posts' : 'My Blog'}
              </Link>
              <Link
                href='/write'
                prefetch={false}
                className={`hover:text-blue-600 ${
                  isWritePage && 'text-blue-600'
                }`}
              >
                Add Post
              </Link>
              <div ref={btnRef} className='relative'>
                <UserAvartar
                  imageUrl={loginUser.image}
                  username={loginUser.username}
                  size='medium'
                  type='button'
                  onClick={() => setIsOpenNav((prev) => !prev)}
                  icon={isOpenNav ? <IoMdArrowDropdown /> : <IoMdArrowDropup />}
                />
                {isOpenNav && (
                  <DropDownNav
                    navList={navList}
                    isOpen={isOpenNav}
                    closeModal={() => setIsOpenNav(false)}
                    btnRef={btnRef}
                  />
                )}
              </div>
            </>
          )}

          {!session && <Button onClick={signIn}>로그인</Button>}
        </nav>
      </div>
    </header>
  );
}

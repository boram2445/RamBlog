'use client';

import Link from 'next/link';
import useSWR from 'swr';
import PlanetLogo from '../../asset/icons/planet_logo.svg';
import Image from 'next/image';
import { signIn, signOut, useSession } from 'next-auth/react';
import Button from '../ui/Button';
import { useParams, usePathname, useRouter } from 'next/navigation';
import UserAvartar from './UserAvartar';
import { useRef, useState } from 'react';
import DropDownNav from './DropDownNav';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import { UserData } from '@/model/user';
import useUser from '@/hooks/useUser';
import { BsSearch } from 'react-icons/bs';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const { userProfile } = useUser(params.user as string);

  const { data: session } = useSession();
  const user = session?.user;

  const { data: loginUser } = useSWR<UserData>(
    user ? `/api/${user.username}/me` : null
  );

  const [isOpenNav, setIsOpenNav] = useState(false);
  const btnRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  const navList = [
    { label: '내 블로그', onClick: () => router.push(`/${user?.username}`) },
    { label: '글 쓰기', onClick: () => router.push(`/write`) },
    {
      label: '프로필 설정',
      onClick: () => router.push(`/${user?.username}/me/setting`),
    },
    { label: '로그아웃', onClick: signOut },
  ];

  const isWritePage = user && pathname.includes('/write');

  return (
    <header className='sticky top-0 z-10 w-full backdrop-blur-sm flex-none transition-colors duration-500 shadow-sm dark:border-slate-50/[0.06] bg-white/95 supports-backdrop-blur:bg-white/60 dark:bg-transparent animate-fade-in-down'>
      <div className='min-h-[64px] max-w-screen-2xl mx-auto px-5 py-2 flex justify-between items-center'>
        <div className='flex gap-2 items-center'>
          <Link href='/'>
            <Image src={PlanetLogo} width={38} alt='RamBlog 로고' />
          </Link>
          {params.user ? (
            <Link href={`/${params.user}`}>
              <h1 className='text-xl font-semibold hover:text-indigo-600'>
                {userProfile?.blogName}
              </h1>
            </Link>
          ) : (
            <Link href='/'>
              <h1 className='text-xl font-semibold'>RAMBLOG</h1>
            </Link>
          )}
        </div>
        <nav className='flex items-center gap-x-5 mr-4'>
          <Link href={params.user ? `/${params.user}/search` : '/search'}>
            <BsSearch className='w-5 h-5 text-gray-500 hover:text-indigo-500' />
          </Link>
          {loginUser && (
            <>
              <Link
                href='/write'
                prefetch={false}
                className={`hidden tablet:block hover:text-indigo-600 ${
                  isWritePage && 'text-indigo-600'
                }`}
              >
                Write Post
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
          {!session && <Button onClick={() => signIn()}>로그인</Button>}
        </nav>
      </div>
    </header>
  );
}

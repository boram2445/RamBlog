import Link from 'next/link';
import logo from '../../asset/icons/logo.svg';
import { BsGithub } from 'react-icons/bs';
import Image from 'next/image';

export default function Header() {
  return (
    <header>
      <div className='max-w-screen-lg mx-auto px-5 py-4 flex justify-between items-center'>
        <Link href='/' className='text-xl cursor-pointer'>
          <Image src={logo} alt='RAMBLOG 로고' width={120} />
        </Link>
        <div className='flex gap-x-5 mr-4'>
          <nav className='flex gap-x-4 items-center'>
            <Link
              href='/about'
              className='cursor-pointer text-sm font-medium text-black-gray'
            >
              ABOUT
            </Link>
            <Link
              href='/posts'
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
            <Link
              href='/contact'
              className='cursor-pointer text-sm font-medium text-black-gray'
            >
              CONTACT
            </Link>
          </nav>
          <div>
            <Link href='https://github.com/boram2445' target='_blank'>
              <BsGithub className='cursor-pointer text-2xl text-bronze' />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

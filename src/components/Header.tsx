import Link from 'next/link';
import { BsGithub } from 'react-icons/bs';

export default function Header() {
  return (
    <header className=' bg-light-brown'>
      <div className='max-w-screen-lg mx-auto px-5 py-4 flex justify-between items-center'>
        <Link href='/' className='text-xl cursor-pointer'>
          RAMBLOG
        </Link>
        <div className='flex gap-x-8'>
          <nav className='flex gap-x-4 items-center'>
            <Link
              href='/about'
              className='cursor-pointer text-sm font-medium text-dark-gray'
            >
              ABOUT
            </Link>
            <Link
              href='/posts'
              className='cursor-pointer text-sm font-medium text-dark-gray'
            >
              POSTS
            </Link>
            <Link
              href='/contact'
              className='cursor-pointer text-sm font-medium text-dark-gray'
            >
              CONTACT
            </Link>
          </nav>
          <div>
            {/* 외부 링크는 a태그 사용하면 될까..? */}
            <a href='https://github.com/boram2445' target='_blank'>
              <BsGithub className='cursor-pointer text-2xl text-bronze' />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

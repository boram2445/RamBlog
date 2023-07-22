import Link from 'next/link';
import { BsGithub } from 'react-icons/bs';

export default function Header() {
  return (
    <header className=' bg-light-brown'>
      <div className='max-w-screen-lg mx-auto px-5 py-4 flex justify-between items-center'>
        <Link href='/' className='text-xl cursor-pointer'>
          RAMBLOG
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

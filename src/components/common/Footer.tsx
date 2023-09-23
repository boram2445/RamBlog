import Link from 'next/link';
import PlanetLogo from '../../asset/icons/planet_logo.svg';
import Image from 'next/image';
import { BsGithub } from 'react-icons/bs';

export default function Footer() {
  return (
    <footer className='mt-12 border-t border-gray-200 dark:border-neutral-700 '>
      <div className='max-w-screen-2xl mx-auto px-4 py-6 '>
        <Link href='/' className='flex items-center gap-2 mb-4'>
          <Image src={PlanetLogo} width={38} alt='RamBlog 로고' />
          <h1 className='text-xl font-semibold  text-gray-700 dark:text-slate-300'>
            RAMBLOG
          </h1>
        </Link>
        <div className='flex justify-between text-gray-600 flex-col laptop:flex-row gap-2 laptop:gap-0 dark:text-slate-400'>
          <small>Copyright ⓒ 2023 Kim Boram All Rights Reserved.</small>
          <div className='flex gap-4 items-center'>
            <small>김보람 | boram2445@gmail.com</small>
            <a href='https://github.com/boram2445' target='_blank'>
              <BsGithub className='hover:opacity-60 h-5 w-5' />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

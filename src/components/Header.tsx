import Link from 'next/link';

export default function Header() {
  return (
    <header className='px-5 py-4 flex justify-between items-center bg-slate-100/50 border-b-2 border-white'>
      <Link href='/' className='text-xl cursor-pointer'>
        RAMBLOG
      </Link>
      <nav className='flex gap-x-4'>
        <Link href='/about' className='cursor-pointer text-sm font-medium'>
          ABOUT
        </Link>
        <Link href='/posts' className='cursor-pointer text-sm font-medium'>
          POSTS
        </Link>
        <Link href='/contact' className='cursor-pointer text-sm font-medium'>
          CONTACT
        </Link>
      </nav>
    </header>
  );
}

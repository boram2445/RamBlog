import './globals.css';
import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import Link from 'next/link';

const notoSansKr = Noto_Sans_KR({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
});
export const metadata: Metadata = {
  title: 'RamBlog',
  description: 'frontend engineer Boram blog🐥',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={`h-screen flex flex-col ${notoSansKr.className}`}>
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
            <Link
              href='/contact'
              className='cursor-pointer text-sm font-medium'
            >
              CONTACT
            </Link>
          </nav>
        </header>
        <main className='flex-1 mx-auto w-full'>{children}</main>
        <footer className='p-4 bg-slate-700 text-slate-300'>
          <div className='flex gap-2 text-sm '>
            <small>김보람</small>
            <small>boram2445@gamil.com</small>
            <small>githumb.com/boram2445</small>
          </div>
          <small>Copyright ⓒ 2023 Kim Boram All Rights Reserved.</small>
        </footer>
      </body>
    </html>
  );
}

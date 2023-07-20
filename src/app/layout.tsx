import './globals.css';
import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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
        <Header />
        <main className='flex-1 mx-auto w-full'>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

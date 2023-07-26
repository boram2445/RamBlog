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
  title: { default: 'RamBlog', template: 'RamBlog | %s' },
  description: 'frontend engineer Boram blog🐥',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body
        className={`h-screen flex flex-col bg-white-brown ${notoSansKr.className}`}
      >
        <Header />
        <main className='grow mx-auto mb-32 w-full'>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

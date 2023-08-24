import './globals.css';
import type { Metadata } from 'next';
import { Open_Sans } from 'next/font/google';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import SWRConfigContext from '@/context/SWRConfigContext';
import AuthContext from '@/context/AuthContext';

const openSans = Open_Sans({
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
      <body className={`h-screen flex flex-col  ${openSans.className}`}>
        <AuthContext>
          <Header />
          <SWRConfigContext>
            <main className='grow mx-auto mb-32 w-full'>{children}</main>
          </SWRConfigContext>
        </AuthContext>
        <Footer />
      </body>
    </html>
  );
}

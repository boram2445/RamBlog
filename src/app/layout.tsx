import './globals.css';
import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import SWRConfigContext from '@/context/SWRConfigContext';
import AuthContext from '@/context/AuthContext';

const notoSansKr = Noto_Sans_KR({
  weight: ['100', '400', '700', '900'],
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
      <body className={`h-screen flex flex-col ${notoSansKr.className}`}>
        <AuthContext>
          <SWRConfigContext>
            <Header />
            <main className='grow w-full mx-auto px-6 laptop:px-8'>
              {children}
            </main>
          </SWRConfigContext>
        </AuthContext>
        <Footer />
      </body>
    </html>
  );
}

import './globals.css';
import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import SWRConfigContext from '@/context/SWRConfigContext';
import AuthContext from '@/context/AuthContext';
import DarkModeProvider from '@/context/DarkModeProvider';

const notoSansKr = Noto_Sans_KR({
  weight: ['100', '400', '700', '900'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'RamBlog',
  description: 'Blog for all developers',
  verification: {
    google: process.env.GOOGLE_VERIFICATION_ID,
  },
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
    <html lang='en' suppressHydrationWarning={true}>
      <body className={`h-screen flex flex-col ${notoSansKr.className}`}>
        <DarkModeProvider>
          <AuthContext>
            <SWRConfigContext>
              <Header />
              <main className='grow w-full mx-auto px-4 tablet:px-6 laptop:px-8'>
                {children}
              </main>
            </SWRConfigContext>
          </AuthContext>
          <Footer />
        </DarkModeProvider>
      </body>
    </html>
  );
}

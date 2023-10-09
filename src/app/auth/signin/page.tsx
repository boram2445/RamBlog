import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import Signin from '@/components/signin/Signin';

export const metadata: Metadata = {
  title: 'Signin',
  description: 'Sginin to RamBlog',
};

type Props = {
  searchParams: {
    callbackUrl: string;
  };
};

export default async function SigninPage({
  searchParams: { callbackUrl },
}: Props) {
  const session = await getServerSession(authOptions);

  if (session) redirect('/');

  return (
    <section className='mx-auto max-w-2xl my-10 first-letter:flex justify-center flex-col '>
      <h1 className='mb-7 text-gray-800 dark:text-slate-300 text-3xl font-semibold py-4'>
        Sign in to RamBlog
      </h1>
      <Signin callbackUrl={callbackUrl ?? '/'} />
    </section>
  );
}

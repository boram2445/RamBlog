import Register from '@/components/register/Register';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Signup',
  description: 'Sginup or Login to RamBlog',
};

export default async function RegisterPage() {
  const session = await auth();

  if (session) redirect('/');

  return (
    <section className='mx-auto max-w-2xl my-10 relative flex justify-center flex-col'>
      <h1 className='mb-7 text-gray-800 text-3xl font-semibold py-4 dark:text-slate-300'>
        Sign up to RamBlog
      </h1>
      <Register />
    </section>
  );
}

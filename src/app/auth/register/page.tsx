import Register from '@/components/register/Register';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export const metadata: Metadata = {
  title: 'Signup',
  description: 'Sginup or Login to RamBlog',
};

export default async function RegisterPage() {
  const session = await getServerSession(authOptions);

  if (session) redirect('/');

  return (
    <section className='mx-auto max-w-2xl my-10 relative flex justify-center flex-col'>
      <h1 className='mb-7 text-gray-800 text-3xl font-semibold py-4'>
        Sign up to RamBlog
      </h1>
      <Register />
    </section>
  );
}

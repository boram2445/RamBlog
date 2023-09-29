'use client';

import { useState } from 'react';
import Button from '../ui/Button';
import RegisterForm from './RegisterForm';
import { FcGoogle } from 'react-icons/fc';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [isOepnForm, setIsOpenForm] = useState(false);

  const handleGoogleSignin = () => signIn('google', { callbackUrl: '/' });

  return (
    <>
      <Button size='max' color='black' onClick={handleGoogleSignin}>
        <FcGoogle /> Sign up with Google
      </Button>
      <hr className={`h-[1px] my-7 bg-gray-200`} />
      <Button size='max' onClick={() => setIsOpenForm(true)}>
        Continue with email
      </Button>
      <p className='mt-5 text-center text-gray-400'>
        {`Have an account?  `}
        <Link
          href={'/auth/signin'}
          className='underline text-indigo-400 hover:text-indigo-500'
        >
          Sign in
        </Link>
      </p>
      {isOepnForm && <RegisterForm closeForm={() => setIsOpenForm(false)} />}
    </>
  );
}

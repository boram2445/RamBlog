'use client';

import { ClientSafeProvider, signIn } from 'next-auth/react';
import Button from '../ui/Button';
import Link from 'next/link';
import { FcGoogle } from 'react-icons/fc';
import SigninForm from './SigninForm';

type Props = {
  callbackUrl: string;
};

export default function Signin({ callbackUrl }: Props) {
  const handleGoogleSignin = () => signIn('google', { callbackUrl });

  return (
    <>
      <Button size='max' onClick={handleGoogleSignin}>
        <FcGoogle />
        Sign In with Google
      </Button>
      <hr className={`h-[1px] my-7 bg-gray-200`} />
      <SigninForm />
      <p className='text-center text-gray-400'>
        {`Don't have an account?  `}
        <Link
          href={'/auth/register'}
          className='underline text-indigo-400 hover:text-indigo-500'
        >
          Sign up
        </Link>
      </p>
    </>
  );
}

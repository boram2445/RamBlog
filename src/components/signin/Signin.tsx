'use client';

import { ClientSafeProvider, signIn } from 'next-auth/react';
import Button from '../ui/Button';

type Props = {
  providers: Record<string, ClientSafeProvider>;
  callbackUrl: string;
};

export default function Signin({ providers, callbackUrl }: Props) {
  return (
    <>
      {Object.values(providers).map(({ name, id }) => (
        <Button
          key={id}
          onClick={() => signIn(id, { callbackUrl })}
          size='big'
        >{`Sign In with ${name}`}</Button>
      ))}
    </>
  );
}

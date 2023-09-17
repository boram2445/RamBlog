'use client';

import { useSession } from 'next-auth/react';
import Button from '../ui/Button';
import { useState } from 'react';
import LogForm from './LogForm';
import Title from '../ui/Title';
import ModalContainer from '../ui/ModalContainer';

type Props = {
  username: string;
};

export default function LogHero({ username }: Props) {
  const { data: session } = useSession();
  const user = session?.user;

  const [isOpenForm, setIsOpenForm] = useState(false);

  return (
    <>
      {user?.username === username && (
        <div className='mb-3 ml-3'>
          <Button onClick={() => setIsOpenForm(true)}>일기쓰기</Button>
        </div>
      )}
      {isOpenForm && (
        <ModalContainer
          onClose={() => setIsOpenForm(false)}
          className='bg-gray-100 rounded-lg p-5'
        >
          <LogForm username={username} closeForm={() => setIsOpenForm(false)} />
        </ModalContainer>
      )}
    </>
  );
}

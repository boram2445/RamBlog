'use client';

import { useSession } from 'next-auth/react';
import Button from '../ui/Button';
import { useState } from 'react';
import LogForm from './LogForm';
import Title from '../ui/Title';

type Props = {
  username: string;
};

export default function LogHero({ username }: Props) {
  const { data: session } = useSession();
  const user = session?.user;

  const [isOpenForm, setIsOpenForm] = useState(false);

  return (
    <>
      <div className='flex justify-between items-center mb-12'>
        <Title
          title='Short Diary'
          description='오늘의 생각, 일상, 기분, 공부한것들을 기록합니다'
        />
        {user?.username === username && (
          <Button onClick={() => setIsOpenForm((prev) => !prev)}>
            {isOpenForm ? '닫기' : '일기쓰기'}
          </Button>
        )}
      </div>
      {isOpenForm && (
        <LogForm
          username={username}
          closeForm={() => setIsOpenForm((prev) => !prev)}
        />
      )}
    </>
  );
}

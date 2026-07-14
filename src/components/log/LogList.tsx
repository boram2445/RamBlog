'use client';

import { useSession } from 'next-auth/react';
import useLogs from '@/hooks/useLogs';
import LogCard, { LogCardLoading } from './LogCard';
import SelectBox, { SelectItem } from '../ui/SelectBox';
import { useState } from 'react';
import { Emotion } from '@/model/log';
import Button from '../ui/Button';
import ModalContainer from '../ui/ModalContainer';
import LogForm from './LogForm';
import NoContent from '../ui/NoContent';

type Props = {
  username: string;
  userId?: string;
};

const listStyle =
  'mx-auto py-8 px-1 tablet:px-4 grid grid-cols-2 tablet:grid-cols-3 gap-2';

export default function LogList({ username, userId }: Props) {
  const { data: session } = useSession();
  const user = session?.user;

  const [selected, setSelected] = useState<SelectItem>(selectList[0]);
  const { logs, isLoading, error } = useLogs(
    username,
    selected.label as Emotion & 'all'
  );

  const [isOpenForm, setIsOpenForm] = useState(false);
  const handleChangeSelect = (item: SelectItem) => setSelected(item);

  return (
    <>
      <div className='flex justify-between items-center'>
        <SelectBox
          list={selectList}
          selected={selected}
          onSelectChange={handleChangeSelect}
          type='emoji'
        />
        {!!user?.id && user.id === userId && (
          <Button onClick={() => setIsOpenForm(true)}>일기쓰기</Button>
        )}
      </div>
      {isLoading && <LogListLoading />}
      {!isLoading && logs?.length === 0 && (
        <NoContent text='아직 등록된 일기가 없어요😥' />
      )}
      {!isLoading && !error && (
        <ul className={listStyle}>
          {logs?.map((log) => (
            <li key={log.id}>
              <LogCard
                log={log}
                resetSelect={() => handleChangeSelect(selectList[0])}
                selectedEmotion={selected.label as 'all' & Emotion}
              />
            </li>
          ))}
        </ul>
      )}

      {isOpenForm && (
        <ModalContainer
          onClose={() => setIsOpenForm(false)}
          className='overflow-y-hidden bg-white w-4/5 h-4/5 tablet:h-[440px] laptop:h-[480px] desktop:max-w-[1000px] desktop:h-[580px] dark:bg-neutral-800'
        >
          <LogForm
            username={username}
            closeForm={() => setIsOpenForm(false)}
            resetSelect={() => handleChangeSelect(selectList[0])}
          />
        </ModalContainer>
      )}
    </>
  );
}

export function LogListLoading() {
  return (
    <ul className={listStyle}>
      {Array.from({ length: 3 }, (_, index) => (
        <LogCardLoading key={index} />
      ))}
    </ul>
  );
}

const selectList = [
  { id: 0, label: 'all', text: '전체 보기' },
  {
    id: 1,
    label: 'love',
    text: '사랑',
  },
  {
    id: 2,
    label: 'happy',
    text: '행복',
  },
  {
    id: 3,
    label: 'normal',
    text: '보통',
  },
  {
    id: 4,
    label: 'bad',
    text: '나쁨',
  },
  {
    id: 5,
    label: 'heart',
    text: '고통',
  },
];

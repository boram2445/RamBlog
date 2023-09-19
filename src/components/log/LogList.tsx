'use client';

import useLogs from '@/hooks/useLogs';
import LogCard from './LogCard';
import SelectBox, { SelectItem } from '../ui/SelectBox';
import { useState } from 'react';
import { Emotion } from '@/service/log';

type Props = {
  username: string;
};

export default function LogList({ username }: Props) {
  const [selected, setSelected] = useState<SelectItem>(selectList[0]);
  const { logs } = useLogs(username, selected.label as Emotion & 'all');

  const handleChangeSelect = (item: SelectItem) => setSelected(item);

  return (
    <>
      <SelectBox
        list={selectList}
        selected={selected}
        onSelectChange={handleChangeSelect}
        type='emoji'
      />
      {logs?.length === 0 && (
        <p className='text-center text-gray-700'>아직 등록된 일기가 없어요😥</p>
      )}
      <ul className='mx-auto py-8 px-4 grid grid-cols-2 tablet:grid-cols-3 gap-2'>
        {logs?.map((log) => (
          <li key={log.id}>
            <LogCard log={log} />
          </li>
        ))}
      </ul>
    </>
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

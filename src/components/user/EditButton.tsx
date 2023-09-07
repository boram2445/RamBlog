'use client';

import { useRouter } from 'next/navigation';
import { BsThreeDotsVertical } from 'react-icons/bs';
import DropDownNav from '../common/DropDownNav';
import { useRef, useState } from 'react';

type Props = {
  username: string;
};

export default function EditButton({ username }: Props) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const btnRef = useRef() as React.MutableRefObject<HTMLButtonElement>;
  const navList = [
    {
      label: '프로필 수정',
      onClick: () => router.push(`/${username}/me/profile`),
    },
  ];

  return (
    <div className='absolute top-12 right-7 w-20 flex flex-col items-end'>
      <button
        className='relative right-0 outline-none'
        onClick={() => setIsOpen((prev) => !prev)}
        ref={btnRef}
      >
        <BsThreeDotsVertical
          className={`w-5 h-5 ${
            isOpen ? 'text-gray-800' : 'text-gray-500'
          } hover:text-gray-800 `}
        />
      </button>
      {isOpen && (
        <div className='relative w-28'>
          <DropDownNav
            navList={navList}
            isOpen={isOpen}
            closeModal={() => setIsOpen(false)}
            btnRef={btnRef}
            width='w-28'
          />
        </div>
      )}
    </div>
  );
}

'use client';

import { useCallback, useEffect, useRef } from 'react';

type Props = {
  navList: { label: string; onClick: () => void }[];
  isOpen: boolean;
  closeModal: () => void;
  btnRef: React.MutableRefObject<HTMLInputElement | HTMLButtonElement>;
  width?: string;
};

export default function DropDownNav({
  navList,
  isOpen,
  closeModal,
  btnRef,
  width,
}: Props) {
  const navRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  //밖을 클릭함
  const handleClickOutside = useCallback(
    ({ target }: MouseEvent) => {
      if (
        !(
          btnRef.current?.contains(target as Node) ||
          navRef.current?.contains(target as Node)
        )
      ) {
        closeModal();
      }
    },
    [btnRef, closeModal]
  );

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('click', handleClickOutside);
    }
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, [handleClickOutside, isOpen]);
  return (
    <nav
      ref={navRef}
      className={`mt-1 absolute right-0 ${
        width ? width : 'w-full'
      }  border border-gray-200 flex flex-col rounded-lg overflow-hidden z-10 dark:border-neutral-700`}
    >
      {navList.map((nav, index) => (
        <button
          key={index}
          onClick={() => {
            nav.onClick();
            closeModal();
          }}
          className='bg-white hover:bg-gray-50 w-full py-2 px-2 text-sm text-gray-700 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-slate-300 '
        >
          {nav.label}
        </button>
      ))}
    </nav>
  );
}

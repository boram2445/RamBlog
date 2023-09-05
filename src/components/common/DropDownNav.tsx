'use client';

import { useCallback, useEffect, useRef } from 'react';

type Props = {
  navList: { label: string; onClick: () => void }[];
  isOpen: boolean;
  closeModal: () => void;
  btnRef: React.MutableRefObject<HTMLInputElement>;
};

export default function DropDownNav({
  navList,
  isOpen,
  closeModal,
  btnRef,
}: Props) {
  const navRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  const handleClickOutside = useCallback(
    ({ target }: MouseEvent) => {
      if (
        !(
          btnRef.current?.contains(target as Node) ||
          navRef.current?.contains(target as Node)
        )
      )
        closeModal();
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
      className='mt-2 w-full absolute right-0 border border-gray-200 flex flex-col rounded-lg overflow-hidden'
    >
      {navList.map((nav, index) => (
        <button
          key={index}
          onClick={nav.onClick}
          className='hover:bg-gray-50 w-full py-2 px-2 text-sm text-gray-700'
        >
          {nav.label}
        </button>
      ))}
    </nav>
  );
}

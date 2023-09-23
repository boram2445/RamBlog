import React, { useEffect, useState, useRef } from 'react';
import EmotionItem from '../log/EmotionItem';
import { Emotion } from '@/service/log';
import { AiFillCaretDown, AiFillCaretUp } from 'react-icons/ai';

export type SelectItem = { id: number; label: string; text?: string };
type Props = {
  list: SelectItem[];
  selected: SelectItem;
  onSelectChange: (item: SelectItem) => void;
  type?: 'label' | 'emoji';
};

export default function SelectBox({
  list,
  onSelectChange,
  selected,
  type = 'label',
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const selectBoxRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  const clickOutsideHandler = ({ target }: MouseEvent) => {
    if (!selectBoxRef?.current.contains(target as Node)) setIsOpen(false);
  };

  const openHandler = () => setIsOpen((prev) => !prev);
  const selectHandler = (item: SelectItem) => {
    onSelectChange(item);
    openHandler();
  };

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('click', clickOutsideHandler);
    }
    return () => {
      window.removeEventListener('click', clickOutsideHandler);
    };
  }, [isOpen]);

  return (
    <article ref={selectBoxRef} className='inline-block'>
      <button
        onClick={openHandler}
        className='flex items-center gap-1 py-2 pl-4 pr-3 text-sm font-medium text-center text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:border-neutral-700'
      >
        <ListItem type={type} item={selected} />
        {!isOpen ? <AiFillCaretUp /> : <AiFillCaretDown />}
      </button>
      <div
        className={`absolute mt-1 ${
          isOpen ? 'block' : 'hidden'
        } z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-neutral-800 dark:border dark:border-neutral-700`}
      >
        <ul className='py-2 text-sm text-gray-700 dark:text-gray-200'>
          {list.map((item, index) => (
            <li key={index}>
              <button
                type='button'
                className='w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-neutral-700'
                onClick={() => selectHandler(item)}
              >
                <ListItem type={type} item={item} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function ListItem({
  type,
  item,
}: {
  type: 'label' | 'emoji';
  item: SelectItem;
}) {
  return (
    <>
      {type === 'label' && <small>{item.label}</small>}
      {type === 'emoji' && (
        <div className='flex gap-2 items-center'>
          {item.label !== 'all' && (
            <EmotionItem label={item.label as Emotion} />
          )}
          <small className='text-sm text-gray-600 dark:text-slate-300'>
            {item.text}
          </small>
        </div>
      )}
    </>
  );
}

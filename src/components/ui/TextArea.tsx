'use client';

import { ChangeEvent, useEffect, useRef } from 'react';

type Props = {
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  name: string;
  placeholder?: string;
};

export default function TextArea({
  value,
  onChange,
  name,
  placeholder,
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    window.addEventListener('resize', changeTextAreaHeight);
    changeTextAreaHeight();
    return () => {
      window.removeEventListener('resize', changeTextAreaHeight);
    };
  }, []);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e);
    changeTextAreaHeight();
  };

  const changeTextAreaHeight = () => {
    if (textareaRef?.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + 'px';
    }
  };

  return (
    <textarea
      ref={textareaRef}
      className='w-full px-4 py-2 textarea'
      value={value}
      name={name}
      onChange={handleChange}
      placeholder={placeholder}
    />
  );
}

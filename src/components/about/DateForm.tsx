'use client';

import { ChangeEvent, useState } from 'react';

type Props = {
  disabled?: boolean;
};

export default function DateForm({ disabled }: Props) {
  const [date, setDate] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const res = replaceValue(e.target.value);
    setDate(res);
  };

  const replaceValue = (value: string) => {
    const val = value.replace(/\D/g, '');
    const len = value.length;

    let result = '';
    if (len < 5) result = val;
    else {
      result += val.substring(0, 4);
      result += '.';
      result += val.substring(4);
    }

    return result;
  };

  return (
    <input
      placeholder={`${disabled ? 'now' : 'YYYY.MM'}`}
      id='date'
      maxLength={7}
      onChange={handleChange}
      className={`py-2 px-3 w-24 rounded-lg outline-indigo-500 text-sm ${
        disabled && 'placeholder:text-indigo-500 bg-gray-200'
      }`}
      value={date}
      disabled={disabled}
    />
  );
}

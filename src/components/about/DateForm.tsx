'use client';

import { ChangeEvent, useState } from 'react';

type Props = {
  target: 'startDate' | 'endDate';
  dateData?: string;
  disabled?: boolean;
  onChange: (target: 'startDate' | 'endDate', value: string) => void;
};

export default function DateForm({
  target,
  dateData,
  disabled,
  onChange,
}: Props) {
  const [date, setDate] = useState(dateData ?? '');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const res = replaceValue(e.target.value);
    setDate(res);

    onChange(target, res);
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
      className={`input disabled:hover:border-gray-100 dark:disabled:hover:border-neutral-700 dark:disabled:bg-neutral-700 py-2 px-3 w-24 text-sm ${
        disabled &&
        'placeholder:text-indigo-500 bg-gray-200 dark:placeholder:text-indigo-100 '
      }`}
      value={disabled ? '' : date}
      disabled={disabled}
      autoComplete='off'
    />
  );
}

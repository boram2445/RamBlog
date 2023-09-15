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
      className={`border border-gray-100 hover:border-indigo-500 disabled:hover:border-gray-100 py-2 px-3 w-24 rounded-lg outline-indigo-500 text-sm ${
        disabled && 'placeholder:text-indigo-500 bg-gray-200'
      }`}
      value={disabled ? '' : date}
      disabled={disabled}
    />
  );
}

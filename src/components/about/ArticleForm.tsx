'use client';

import { ChangeEvent, useState } from 'react';
import DateForm from './DateForm';
import { Experience, Project } from '@/service/portfolio';
import { IoMdClose } from 'react-icons/io';
import { ExperienceItem } from './AboutForm';

type Props = {
  experience?: Experience | Project;
  label: string;
  onRemove: (id: string) => void;
  onChange?: (
    target: ExperienceItem,
    value: string | boolean,
    id: string
  ) => void;
};

const labelStyle = 'mb-1 text-gray-500 text-sm block';
const inputStyle =
  'mb-2 py-2 px-3 w-full rounded-lg outline-indigo-500 border border-gray-200 hover:border-indigo-400';

export default function ArticleForm({
  experience,
  label,
  onRemove,
  onChange,
}: Props) {
  const [isHolding, setIsHolding] = useState(experience?.holding ?? false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    let newData: string | boolean = value;
    if (name === 'holding') {
      newData = !isHolding;
      setIsHolding((prev) => !prev);
    }
    experience?.id &&
      onChange?.(name as ExperienceItem, newData, experience?.id);
  };

  const handleDate = (target: 'startDate' | 'endDate', res: string) => {
    experience?.id && onChange?.(target, res, experience?.id);
  };

  return (
    <div className='relative bg-slate-100 p-5 rounded-lg shadow-sm'>
      <label className={labelStyle}>기본정보</label>
      <input
        type='text'
        name='name'
        placeholder={`${label} 이름`}
        className={inputStyle}
        value={experience?.name ?? ''}
        onChange={handleChange}
      />
      <label className={labelStyle}>기간</label>
      <div>
        <div className='flex'>
          <div className='flex items-center'>
            <DateForm
              target='startDate'
              dateData={experience?.startDate ?? ''}
              onChange={handleDate}
            />
            <span className='text-lg mx-2'>-</span>
            <DateForm
              target='endDate'
              disabled={experience?.holding}
              dateData={!experience?.holding ? experience?.startDate : ''}
              onChange={handleDate}
            />
          </div>
        </div>
        <div className='flex gap-2 items-center'>
          <input
            type='checkbox'
            checked={experience?.holding ?? false}
            onChange={handleChange}
            name='holding'
            id='holding'
            className='w-4 h-4 accent-indigo-500'
          />
          <label htmlFor='holding' className={labelStyle}>
            진행 중
          </label>
        </div>
      </div>
      <label className={labelStyle}>내용</label>
      <textarea
        placeholder='구체적인 내용을 작성해 주세요'
        className={`${inputStyle}`}
        value={experience?.content ?? ''}
        onChange={handleChange}
        name='content'
      />
      <button
        className='absolute top-2 right-2'
        onClick={() => onRemove(experience?.id ?? '')}
        type='button'
      >
        <IoMdClose />
      </button>
    </div>
  );
}

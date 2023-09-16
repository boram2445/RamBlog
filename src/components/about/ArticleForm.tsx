'use client';

import { ChangeEvent, useState } from 'react';
import DateForm from './DateForm';
import { Experience, Project } from '@/service/portfolio';
import { IoMdClose } from 'react-icons/io';
import { ExperienceItem, ExperienceList } from './AboutForm';
import TextArea from '../ui/TextArea';
import ImageUpload from '../ui/ImageUpload';

type Props = {
  experience?: Experience | Project;
  label: string;
  type: ExperienceList;
  onRemove: (id: string) => void;
  onChange?: (
    target: ExperienceItem,
    value: string | boolean | File,
    id: string
  ) => void;
};

const labelStyle = 'text-gray-500 text-sm block';
const inputStyle =
  'mt-1 mb-2 py-2 px-3 w-full rounded-lg outline-indigo-500 border border-gray-200 hover:border-indigo-400';

export default function ArticleForm({
  experience,
  label,
  type,
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

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const files = e.target?.files;
    if (files && files[0]) {
      experience?.id && onChange?.('image', files[0], experience?.id);
    }
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
              dateData={isHolding ? '' : experience?.endDate}
              onChange={handleDate}
            />
          </div>
        </div>
        <div className='my-2 mx-2 flex gap-2 items-center'>
          <input
            type='checkbox'
            checked={experience?.holding ?? false}
            onChange={handleChange}
            name='holding'
            id={`holding-${experience?.id}`}
            className='w-4 h-4 accent-indigo-500 cursor-pointer'
          />
          <label htmlFor={`holding-${experience?.id}`} className={labelStyle}>
            진행 중
          </label>
        </div>
      </div>
      {type === 'projects' && (
        <>
          <ImageUpload
            file={(experience as Project)?.image ?? ''}
            onChange={handleFile}
            styleClass={`h-60 max-w-md rounded-md`}
            text='프로젝트 사진'
          />
          <label className={`${labelStyle} mt-2`}>링크</label>
          <input
            type='text'
            name='link'
            placeholder='링크'
            className={inputStyle}
            value={(experience as Project)?.link ?? ''}
            onChange={handleChange}
          />
        </>
      )}

      <label className={labelStyle}>내용</label>
      <TextArea
        value={experience?.content ?? ''}
        onChange={handleChange}
        name='content'
        placeholder='구체적인 내용을 작성해 주세요'
      />
      <button
        className='absolute top-4 right-4 hover:text-indigo-500'
        onClick={() => onRemove(experience?.id ?? '')}
        type='button'
      >
        <IoMdClose size='22' />
      </button>
    </div>
  );
}

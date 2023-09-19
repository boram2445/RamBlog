import { ChangeEvent, FormEvent, useRef, useState } from 'react';
import Button from '../ui/Button';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import ImageUpload from '../ui/ImageUpload';
import EmotionList from './EmotionList';
import { getDate } from '@/utils/date';
import { mutate } from 'swr';

type Props = {
  username: string;
  closeForm: () => void;
};

const inputStyle =
  'py-2 px-3 w-full rounded-lg outline-indigo-500 border border-gray-200 hover:border-indigo-400';

export default function LogForm({ username, closeForm }: Props) {
  const [file, setFile] = useState<File>();
  const [date, setDate] = useState<string>(
    getDate(new Date().toISOString(), 'day')
  );
  const [selectedEmotion, setSelectedEmotion] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = e.target?.files;
    if (files && files[0]) {
      setFile(files[0]);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log(date + 'T' + new Date().toISOString().split('T')[1]);
    setLoading(true);
    const formData = new FormData();
    file && formData.append('file', file);
    formData.append('title', titleRef.current?.value ?? '');
    formData.append('content', contentRef.current?.value ?? '');
    formData.append('emotion', selectedEmotion?.toString() ?? '');
    formData.append(
      'date',
      date + 'T' + new Date().toISOString().split('T')[1]
    );

    axios
      .post(`/api/${username}/logs`, formData)
      .then(() => {
        mutate(`/api/${username}/logs`);
        mutate(`/api/${username}/log`);
      })
      .catch((err) => setError(err.toString()))
      .finally(() => {
        setLoading(false);
        closeForm();
      });
  };

  return (
    <>
      {loading && (
        <div className='bg-gray-200 absolute inset-0 flex flex-col items-center justify-center z-20 bg-opacity-20'>
          <ClipLoader />
          <p>저장중...</p>
        </div>
      )}
      <form
        className='relative w-full p-5 rounded-lg bg-white'
        onSubmit={handleSubmit}
      >
        <h2 className='ml-2 text-2xl mt-3 mb-5 font-semibold text-gray-800 bg-indigo-200 inline-block px-2 bg-opacity-50 leading-5'>
          오늘의 기록
        </h2>
        <input
          type='date'
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className='ml-2 mb-3 px-1 border outline-indigo-500 border-gray-200 hover:border-indigo-400 rounded-lg cursor-pointer'
        />
        <div className='flex gap-3'>
          <ImageUpload
            file={file}
            onChange={handleChange}
            styleClass='ml-3 h-[200px] w-[300px] rounded-md'
            text='오늘의 사진'
          />
          <div className='grow flex flex-col gap-2'>
            <input
              type='text'
              placeholder='제목'
              ref={titleRef}
              className={inputStyle}
            />
            <textarea
              name='content'
              id='content'
              ref={contentRef}
              className={`grow ${inputStyle}`}
              placeholder='내용을 적어 주세요.'
            />
          </div>
        </div>
        <EmotionList
          selected={selectedEmotion}
          onClick={(label: string) => setSelectedEmotion(label)}
        />
        <div className='mt-3'>
          <Button color='black' size='max' onClick={handleSubmit}>
            등록
          </Button>
        </div>
      </form>
    </>
  );
}

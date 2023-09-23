import { ChangeEvent, FormEvent, useRef, useState } from 'react';
import Button from '../ui/Button';
import axios from 'axios';
import ImageUpload from '../ui/ImageUpload';
import EmotionList from './EmotionList';
import { getDate } from '@/utils/date';
import { mutate } from 'swr';
import PageLoader from '../ui/PageLoader';

type Props = {
  username: string;
  resetSelect: () => void;
  closeForm: () => void;
};

const inputStyle = 'py-2 px-3 w-full input';

export default function LogForm({ username, resetSelect, closeForm }: Props) {
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
        resetSelect();
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
      {loading && <PageLoader label='일기 작성중...' />}
      <form
        className='relative w-full p-5 rounded-lg bg-white dark:bg-neutral-800'
        onSubmit={handleSubmit}
      >
        <div className='flex justify-between items-center'>
          <div>
            <h2 className='ml-2 mt-3 mb-5 color-title'>오늘의 기록</h2>
            <input
              type='date'
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className='ml-2 mb-3 px-1 input'
            />
          </div>
          <Button color='black' onClick={handleSubmit}>
            등록
          </Button>
        </div>
        <div className='flex gap-3'>
          <ImageUpload
            file={file}
            onChange={handleChange}
            styleClass='w-1/2 aspect-square'
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
              className={`grow w-full textarea`}
              placeholder='내용을 적어 주세요.'
            />
            <EmotionList
              selected={selectedEmotion}
              onClick={(label: string) => setSelectedEmotion(label)}
            />
          </div>
        </div>
      </form>
    </>
  );
}

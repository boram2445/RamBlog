import { ChangeEvent, FormEvent, useRef, useState } from 'react';
import Button from '../ui/Button';
import axios from 'axios';
import Image from 'next/image';
import { FaPhotoVideo } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';

type Props = {
  username: string;
  closeForm: () => void;
};

export default function LogForm({ username, closeForm }: Props) {
  const [file, setFile] = useState<File>();
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

    axios
      .post(`/api/${username}/logs`, formData)
      .catch((err) => setError(err.toString()))
      .finally(() => {
        setLoading(false);
        closeForm();
      });
  };

  return (
    <form
      className='relative bg-gray-50 h-300 w-full p-2 mb-5'
      onSubmit={handleSubmit}
    >
      {loading && (
        <div className='bg-gray-200 absolute inset-0 flex flex-col items-center justify-center z-20 bg-opacity-20'>
          <ClipLoader />
          <p>업로드중...</p>
        </div>
      )}
      <div className='flex justify-end mb-1'>
        <Button color='black'>저장</Button>
      </div>
      <div className='flex'>
        <div className='grow flex flex-col'>
          <input
            type='text'
            placeholder='제목'
            ref={titleRef}
            className='px-2 py-1 border border-gray-100 rounded-lg'
          />
          <textarea
            name='content'
            id='content'
            ref={contentRef}
            className='grow px-2 py-1 border-gray-100 rounded-lg'
            placeholder='오늘의 기록'
          />
        </div>
        <input
          className='hidden'
          name='input'
          id='input-upload'
          type='file'
          accept='image/*'
          onChange={handleChange}
        />
        <label
          htmlFor='input-upload'
          className={`ml-3 h-[200px] w-[200px] rounded-md flex flex-col items-center justify-center hover:bg-gray-200 hover:bg-opacity-90 ${
            !file && 'border-2 border-dashed border-orange-400'
          }`}
        >
          {!file && (
            <>
              <FaPhotoVideo />
              <p>Select Image</p>
            </>
          )}
          {file && (
            <div className='relative w-full aspect-square'>
              <Image
                src={URL.createObjectURL(file)}
                alt='local file'
                fill
                sizes='200px'
                className='object-cover'
              />
            </div>
          )}
        </label>
      </div>
    </form>
  );
}

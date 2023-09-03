import { ChangeEvent, FormEvent, useRef, useState } from 'react';
import Button from '../ui/Button';
import axios from 'axios';
import Image from 'next/image';
import { FaPhotoVideo } from 'react-icons/fa';

type Props = {
  username: string;
};

export default function LogForm({ username }: Props) {
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
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    console.log(file, titleRef.current?.value, contentRef.current?.value);
    formData.append('file', file);
    formData.append('title', titleRef.current?.value ?? '');
    formData.append('content', contentRef.current?.value ?? '');

    axios
      .post(`/api/${username}/logs`, formData)
      .catch((err) => setError(err.toString()))
      .finally(() => setLoading(false));
  };

  return (
    <form className='bg-gray-200 h-300 w-full' onSubmit={handleSubmit}>
      <Button>저장</Button>
      <input type='text' placeholder='제목' ref={titleRef} />
      <textarea name='content' id='content' ref={contentRef} />
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
        className={`h-60 rounded-md flex flex-col items-center justify-center hover:bg-gray-200 hover:bg-opacity-90 ${
          !file && 'border border-dashed border-orange-400'
        }`}
      >
        {!file && (
          <>
            <FaPhotoVideo />
            <p>Click here for Select Image</p>
          </>
        )}
        {/* file을 url로 만들어줌 */}
        {file && (
          <div className='relative w-full aspect-square'>
            <Image
              src={URL.createObjectURL(file)}
              alt='local file'
              fill
              sizes='650px'
              className='object-cover'
            />
          </div>
        )}
      </label>
    </form>
  );
}

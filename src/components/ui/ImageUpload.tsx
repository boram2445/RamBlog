import Image from 'next/image';
import { ChangeEvent } from 'react';
import { FaPhotoVideo } from 'react-icons/fa';

type Props = {
  file?: File | Blob | string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  styleClass: string;
  text?: string;
};

export default function ImageUpload({
  file,
  onChange,
  styleClass,
  text,
}: Props) {
  return (
    <>
      <input
        className='hidden'
        name='file'
        id='input-upload'
        type='file'
        accept='image/*'
        onChange={onChange}
      />
      <label
        htmlFor='input-upload'
        className={`${styleClass}  ${
          !file &&
          'border-2 bg-slate-200 border-dashed border-indigo-300 dark:bg-neutral-600'
        } ${
          file && 'bg-black'
        } flex flex-col items-center justify-center hover:brightness-75 overflow-hidden cursor-pointer`}
      >
        {!file && (
          <>
            <FaPhotoVideo className='w-8 h-8 text-gray-600 dark:text-slate-200' />
            {text && (
              <p className='mt-2 text-gray-600 text-sm dark:text-slate-200'>
                {text}
              </p>
            )}
          </>
        )}
        {file && (
          <div className='relative w-full overflow-hidden'>
            <Image
              src={typeof file === 'string' ? file : URL.createObjectURL(file)}
              alt='local file'
              width={300}
              height={200}
              className='w-full object-cover'
            />
          </div>
        )}
      </label>
    </>
  );
}

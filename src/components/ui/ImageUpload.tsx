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
          !file && 'border-2 bg-white border-dashed border-indigo-300'
        } ${
          file && 'bg-black'
        } flex flex-col items-center justify-center hover:brightness-75 overflow-hidden cursor-pointer`}
      >
        {!file && (
          <>
            <FaPhotoVideo size='30' color='gray' />
            {text && <p className='text-gray-600 text-sm'>{text}</p>}
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

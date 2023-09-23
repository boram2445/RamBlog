import { ChangeEvent } from 'react';
import Avartar from '../ui/Avartar';
import { AiOutlineCamera } from 'react-icons/ai';

type Props = {
  image: string | File;
  username: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export default function UserImageForm({ image, username, onChange }: Props) {
  return (
    <div>
      <div className='relative'>
        <div className='p-3 border border-gray-200 rounded-full dark:border-neutral-700'>
          <Avartar
            imageUrl={
              !image
                ? ''
                : typeof image === 'string'
                ? image
                : URL.createObjectURL(image)
            }
            username={username}
            type='max'
          />
        </div>
        <input
          className='hidden input'
          name='input'
          id='input-upload'
          type='file'
          accept='image/*'
          onChange={onChange}
        />
        <label
          htmlFor='input-upload'
          className='absolute bottom-0 right-0 flex items-center justify-center w-12 h-12 bg-white border border-gray-200 hover:bg-gray-100 padding-4 rounded-full cursor-pointer dark:bg-neutral-800 dark:border-neutral-700 dark:hover:brightness-125'
        >
          <AiOutlineCamera className='w-6 h-6 text-gray-300' />
        </label>
      </div>
    </div>
  );
}

import { ClipLoader } from 'react-spinners';

export default function MiniLoader() {
  return (
    <div className='flex justify-center'>
      <ClipLoader className='text-gray-500 dark:text-slate-200' />
    </div>
  );
}

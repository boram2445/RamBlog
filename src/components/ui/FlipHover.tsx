import { ReactNode } from 'react';

type Props = {
  front: ReactNode;
  back: ReactNode;
};

export default function FlipHover({ front, back }: Props) {
  return (
    <div className='relative w-[250px] h-[230px] text-white overflow-hidden transition-all duration-700 card'>
      <div className='absolute inset-0 w-full h-full flex justify-center items-center transition-all duration-100 delay-200 z-20 hover:opacity-0 bg-salte-50'>
        {front}
      </div>
      <div className='absolute inset-0 w-full h-full flex justify-center items-center bg-slate-50 transition-all z-10 card-back'>
        {back}
      </div>
    </div>
  );
}

import Skeleton from '@/components/ui/Skeleton';
import Title from '@/components/ui/Title';

export default function Loading() {
  return (
    <>
      <div className='mb-6'>
        <Title title='About me' />
      </div>
      <Skeleton className='w-1/2 h-[1.5rem]' />
      <Skeleton className='mt-3 w-2/3 h-[1.5rem]' />
    </>
  );
}

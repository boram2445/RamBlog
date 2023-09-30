import Skeleton from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className='flex justify-between items-center'>
      <Skeleton className='w-[5rem] h-[1.5rem]' />
      <Skeleton className='w-[5rem] h-[1.5rem]' />
    </div>
  );
}

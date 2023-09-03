import LogList from '@/components/log/LogList';

type Props = {
  params: { user: string };
};

export default function LogPage({ params: { user } }: Props) {
  return (
    <>
      <div className='flex gap-4 items-baseline mb-12'>
        <h1 className='text-3xl font-semibold '>Short Diary</h1>
        <span className='text-sm text-gray-400'>
          오늘의 생각, 일상, 기분, 공부한것들을 기록합니다
        </span>
      </div>
      <LogList username={user} />
    </>
  );
}

import Date from '../ui/Date';

type Props = {
  startDate: string;
  endDate: string;
  holding: boolean;
  size?: 'small' | 'big';
  label?: string;
};

export default function DuringDate({
  startDate,
  endDate,
  holding,
  size = 'small',
  label = '진행중',
}: Props) {
  return (
    <div
      className={`flex gap-1 items-center ${
        size === 'small' ? 'text-xs' : 'text-lg'
      }`}
    >
      <Date date={startDate.toString()} dateType='month' type={size} />
      <span>~</span>
      {holding && <span className='text-indigo-500'>{label}</span>}
      {!holding && (
        <Date date={endDate.toString()} dateType='month' type={size} />
      )}
    </div>
  );
}

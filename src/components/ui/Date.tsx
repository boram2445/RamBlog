import { getDate } from '@/utils/date';

type Props = {
  date: string;
  type?: 'small' | 'big';
  dateType?: 'date' | 'time' | 'full';
};

export default function Date({
  date,
  type = 'small',
  dateType = 'full',
}: Props) {
  return (
    <time
      className={`flex gap-2 items-center ${
        type === 'small' && 'text-sm'
      } text-gray-500`}
    >
      {getDate(date, dateType)}
    </time>
  );
}

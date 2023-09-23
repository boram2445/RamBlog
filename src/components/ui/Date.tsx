import { getDate } from '@/utils/date';

type Size = 'xsmall' | 'small' | 'big';

type Props = {
  date: string;
  type?: Size;
  dateType?: 'date' | 'time' | 'full' | 'month';
};

export default function Date({
  date,
  type = 'small',
  dateType = 'full',
}: Props) {
  return (
    <time
      className={`flex gap-2 items-center ${getSize(
        type
      )} text-gray-500 dark:text-slate-400`}
    >
      {getDate(date, dateType)}
    </time>
  );
}

function getSize(type: Size) {
  switch (type) {
    case 'xsmall':
      return 'text-xs';
    case 'small':
      return 'text-sm';
    case 'big':
      return 'text-lg';
  }
}

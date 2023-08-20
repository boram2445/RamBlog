import { AiOutlineCalendar } from 'react-icons/ai';

type Props = {
  date: string;
  type?: 'small' | 'big';
};

export default function Date({ date, type = 'small' }: Props) {
  return (
    <time
      className={`flex gap-2 items-center ${type === 'small' && 'text-sm'}`}
    >
      <AiOutlineCalendar size={`${type === 'small' ? '14' : '20'}`} />
      {getDate(date)}
    </time>
  );
}

const getDate = (dateStr: string) => {
  return dateStr.split('T')[0];
};

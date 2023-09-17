import { Emotion } from '@/service/log';
import EmotionItem from './EmotionItem';

type Props = {
  selected?: string;
  onClick: (label: string) => void;
};

export default function EmotionList({ selected, onClick }: Props) {
  return (
    <ul className='flex gap-3 my-4 justify-center'>
      {emotionList.map((item) => (
        <li
          key={item.id}
          className={`${
            selected !== item.label ? 'grayscale' : 'grayscale-0'
          } hover:grayscale-0`}
          onClick={() => onClick(item.label)}
        >
          <EmotionItem label={item.label as Emotion} size='big' />
        </li>
      ))}
    </ul>
  );
}

const emotionList = [
  {
    id: 1,
    label: 'love',
  },
  {
    id: 2,
    label: 'happy',
  },
  {
    id: 3,
    label: 'normal',
  },
  {
    id: 4,
    label: 'bad',
  },
  {
    id: 5,
    label: 'heart',
  },
];

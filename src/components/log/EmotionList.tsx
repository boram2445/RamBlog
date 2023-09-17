import Image from 'next/image';
import love from '../../../public/images/emotions/1.png';
import happy from '../../../public/images/emotions/2.png';
import normal from '../../../public/images/emotions/3.png';
import bad from '../../../public/images/emotions/4.png';
import heart from '../../../public/images/emotions/5.png';

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
          <Image src={item.image} alt={item.label} width={40} height={40} />
        </li>
      ))}
    </ul>
  );
}

const emotionList = [
  {
    id: 1,
    label: 'love',
    image: love,
  },
  {
    id: 2,
    label: 'happy',
    image: happy,
  },
  {
    id: 3,
    label: 'normal',
    image: normal,
  },
  {
    id: 4,
    label: 'bad',
    image: bad,
  },
  {
    id: 5,
    label: 'heart',
    image: heart,
  },
];

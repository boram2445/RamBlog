import { Emotion } from '@/service/log';
import Image from 'next/image';
import love from '../../../public/images/emotions/1.png';
import happy from '../../../public/images/emotions/2.png';
import normal from '../../../public/images/emotions/3.png';
import bad from '../../../public/images/emotions/4.png';
import heart from '../../../public/images/emotions/5.png';

type Props = {
  label: Emotion;
  size?: 'big' | 'small';
};

export default function EmotionItem({ label, size = 'small' }: Props) {
  return (
    <Image
      src={getImage(label)}
      alt={label}
      width={size === 'small' ? 30 : 40}
      height={size === 'small' ? 30 : 40}
    />
  );
}

function getImage(label: Emotion) {
  switch (label) {
    case 'love':
      return love;
    case 'happy':
      return happy;
    case 'normal':
      return normal;
    case 'bad':
      return bad;
    case 'heart':
      return heart;
  }
}

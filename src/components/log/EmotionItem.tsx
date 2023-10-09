import { Emotion } from '@/model/log';
import Image from 'next/image';
import love from '../../../public/images/emotions/1.png';
import happy from '../../../public/images/emotions/2.png';
import normal from '../../../public/images/emotions/3.png';
import bad from '../../../public/images/emotions/4.png';
import heart from '../../../public/images/emotions/5.png';

type Props = {
  label: Emotion;
  size?: 'big' | 'small';
  type?: 'text' | 'icon';
};

export default function EmotionItem({
  label,
  size = 'small',
  type = 'icon',
}: Props) {
  return (
    <>
      <Image
        src={getImage(label)?.icon}
        alt={label}
        width={size === 'small' ? 30 : 40}
        height={size === 'small' ? 30 : 40}
        placeholder='blur'
      />
      {type === 'text' && <span>{getImage(label)?.text}</span>}
    </>
  );
}

function getImage(label: Emotion) {
  switch (label) {
    case 'love':
      return { icon: love, text: '사랑이 넘쳐요(´ε｀ ʃƪ)♡' };
    case 'happy':
      return { icon: happy, text: '진짜진짜 행복해요(*´∪`)' };
    case 'normal':
      return { icon: normal, text: '그럭저럭 괜찮아요（ΦωΦ）' };
    case 'bad':
      return { icon: heart, text: '열받아 죽겠어요＼(´◓Д◔`)／' };
    case 'heart':
      return { icon: bad, text: '너무 힘들어요( ´△｀)' };
  }
}

import Image from 'next/image';
import Skeleton from './Skeleton';

export type AvartarSize = 'small' | 'medium' | 'big' | 'xl' | 'max';

type Props = {
  imageUrl?: string;
  username: string;
  type?: AvartarSize;
};

export default function Avartar({ imageUrl, username, type = 'small' }: Props) {
  return (
    <div
      className={`relative rounded-full overflow-hidden ${getSizeStyle(type)}`}
    >
      {!imageUrl && (
        <div className='w-full h-full bg-orange-100 border-2 border-dashed border-orange-300 rounded-full'></div>
      )}
      {imageUrl && (
        <Image
          src={imageUrl || ''}
          sizes={getSizeStyle(type)}
          fill
          alt={username}
          className='w-full object-cover aspect-square'
        />
      )}
    </div>
  );
}

export function AvartarLoading({ type }: { type: AvartarSize }) {
  return (
    <Skeleton
      className={`rounded-full overflow-hidden ${getSizeStyle(type)}`}
    />
  );
}

function getSizeStyle(size: AvartarSize) {
  switch (size) {
    case 'small':
      return 'w-8 h-8';
    case 'medium':
      return 'w-10 h-10';
    case 'big':
      return 'w-14 h-14';
    case 'xl':
      return 'w-[110px] h-[110px]';
    case 'max':
      return 'w-[135px] h-[135px]';
  }
}

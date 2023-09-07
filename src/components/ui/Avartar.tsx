type AvartarSize = 'small' | 'medium' | 'big' | 'max';

type Props = {
  imageUrl?: string;
  username: string;
  type?: AvartarSize;
};

export default function Avartar({ imageUrl, username, type = 'small' }: Props) {
  return (
    <div className={`rounded-full overflow-hidden ${getSizeStyle(type)}`}>
      {!imageUrl && (
        <div className='w-full h-full bg-orange-100 border-2 border-dashed border-orange-300 rounded-full'></div>
      )}
      {imageUrl && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element*/}
          <img
            src={imageUrl || ''}
            alt={username}
            className='w-full object-cover'
          />
        </>
      )}
    </div>
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
    case 'max':
      return 'w-[135px] h-[135px]';
  }
}

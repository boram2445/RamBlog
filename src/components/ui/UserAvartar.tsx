import Avartar from './Avartar';

type Props = {
  imageUrl?: string;
  username: string;
  type?: 'small' | 'big';
};

export default function UserAvartar({
  imageUrl,
  username,
  type = 'small',
}: Props) {
  return (
    <div className='flex gap-2 items-center'>
      <Avartar imageUrl={imageUrl} username={username} type={type} />
      <p>{username}</p>
    </div>
  );
}

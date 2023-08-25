type Props = {
  imageUrl?: string;
  username: string;
  type?: 'small' | 'big';
};

export default function Avartar({ imageUrl, username, type = 'small' }: Props) {
  return (
    <div
      className={`rounded-full overflow-hidden ${
        type === 'small' ? 'w-8' : 'w-10'
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element*/}
      <img src={imageUrl || ''} alt={username} />
    </div>
  );
}

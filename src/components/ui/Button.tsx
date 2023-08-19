type Props = {
  color?: 'white' | 'black';
  onClick?: () => void;
  children: React.ReactNode;
};

export default function Button({ color = 'white', onClick, children }: Props) {
  const colorStyle =
    color === 'white'
      ? 'border-gray-300  hover:bg-gray-100  text-gray-700'
      : 'bg-gray-900 hover:bg-gray-700 text-white';

  return (
    <button
      onClick={onClick}
      className={`flex gap-1 items-center py-1.5 px-4 border rounded-lg transition-all text-lg font-semibold ${colorStyle}`}
    >
      {children}
    </button>
  );
}

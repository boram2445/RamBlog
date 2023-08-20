type Props = {
  color?: 'white' | 'black';
  onClick?: () => void;
  children: React.ReactNode;
  type?: 'small' | 'big';
};

export default function Button({
  color = 'white',
  onClick,
  children,
  type = 'small',
}: Props) {
  const colorStyle =
    color === 'white'
      ? 'border-gray-300  hover:bg-gray-100 text-gray-700'
      : 'bg-gray-900 hover:bg-gray-700 text-white';

  return (
    <button
      onClick={onClick}
      className={`flex gap-1 items-center border rounded-lg transition-all  font-semibold ${colorStyle} ${
        type === 'big' ? 'py-1.5 px-4 text-lg' : 'py-1 px-3'
      }`}
    >
      {children}
    </button>
  );
}

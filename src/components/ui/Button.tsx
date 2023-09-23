type Props = {
  color?: 'white' | 'black';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
  size?: ButtonSize;
  type?: 'button' | 'submit';
  disabled?: boolean;
};

type ButtonSize = 'small' | 'medium' | 'big' | 'max';

export default function Button({
  color = 'white',
  onClick,
  children,
  size = 'small',
  type = 'button',
  disabled = false,
}: Props) {
  const colorStyle =
    color === 'white'
      ? 'border-gray-300 hover:bg-gray-100 text-gray-700 dark:text-slate-300 dark:bg-neutral-700 dark:border-neutral-700 dark:hover:brightness-125'
      : 'bg-gray-800 hover:bg-gray-700 text-white dark:bg-slate-300 dark:text-neutral-800 dark:hover:brightness-125';

  return (
    <button
      type={type}
      onClick={onClick}
      className={`flex justify-center gap-1 items-center border rounded-full transition-all font-semibold ${colorStyle} ${getSizeStyle(
        size
      )} ${disabled && 'text-opacity-20'}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

function getSizeStyle(size: ButtonSize) {
  switch (size) {
    case 'small':
      return 'py-1 px-3 text-sm';
    case 'big':
      return 'py-1.5 px-4 text-lg';
    case 'max':
      return 'py-1.5 w-full';
  }
}

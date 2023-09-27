import { ReactNode } from 'react';

type Props = {
  toggled: boolean;
  onToggle: (toggled: boolean) => void;
  onIcon: ReactNode;
  offIcon: ReactNode;
  className?: string;
  title: string;
};

export default function ToggleButton({
  toggled,
  onToggle,
  onIcon,
  offIcon,
  className,
  title,
}: Props) {
  return (
    <button
      onClick={() => onToggle(!toggled)}
      type='button'
      className={className}
      title={title}
    >
      {toggled ? onIcon : offIcon}
    </button>
  );
}

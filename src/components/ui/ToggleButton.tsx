import { ReactNode } from 'react';

type Props = {
  toggled: boolean;
  onToggle: (toggled: boolean) => void;
  onIcon: ReactNode;
  offIcon: ReactNode;
  className?: string;
};

export default function ToggleButton({
  toggled,
  onToggle,
  onIcon,
  offIcon,
  className,
}: Props) {
  return (
    <button
      onClick={() => onToggle(!toggled)}
      type='button'
      className={className}
    >
      {toggled ? onIcon : offIcon}
    </button>
  );
}

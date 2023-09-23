import { BsPlus } from 'react-icons/bs';

type Props = {
  onClick: () => void;
};

export default function AddButton({ onClick }: Props) {
  return (
    <button
      className='text-indigo-500 font-semibold flex gap-1 items-center hover:text-indigo-300'
      type='button'
      onClick={onClick}
    >
      <BsPlus size='22' />
      <span>추가</span>
    </button>
  );
}

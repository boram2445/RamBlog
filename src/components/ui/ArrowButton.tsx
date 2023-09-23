import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';

type Props = {
  className: string;
  type: 'left' | 'right';
  onClick: () => void;
};
export default function ArrowButton({ type, className, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`${className} bg-white rounded-full hover:brightness-75`}
    >
      {type === 'left' && (
        <AiOutlineLeft className='text-gray-600 p-2 w-8 h-8' />
      )}
      {type === 'right' && (
        <AiOutlineRight className='text-gray-600 p-2 w-8 h-8 ' />
      )}
    </button>
  );
}

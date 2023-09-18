import { createPortal } from 'react-dom';
import { AiOutlineClose } from 'react-icons/ai';

type Props = {
  children: React.ReactNode;
  onClose: () => void;
  className?: string;
};

export default function ModalContainer({
  children,
  onClose,
  className,
}: Props) {
  if (typeof window === 'undefined') {
    return null;
  }

  const handleClickContainer = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {createPortal(
        <div
          onClick={handleClickContainer}
          className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50'
        >
          <article className={`${className} animate-fade-in`}>
            {children}
          </article>
          <button
            className='absolute top-4 right-4'
            type='button'
            onClick={onClose}
          >
            <AiOutlineClose className='w-6 h-6 text-white' />
          </button>
        </div>,
        document.body
      )}
    </>
  );
}

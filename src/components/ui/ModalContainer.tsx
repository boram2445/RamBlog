import { createPortal } from 'react-dom';

type Props = {
  children: React.ReactNode;
  onClose: () => void;
};

export default function ModalContainer({ children, onClose }: Props) {
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
          <article className='overflow-y-auto bg-white rounded-2xl w-full max-w-[650px] tablet:w-3/4 min-h-[300px] tablet:h-3/4 animate-fade-in'>
            {children}
          </article>
        </div>,
        document.body
      )}
    </>
  );
}

import { createPortal } from 'react-dom';

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
    console.log(e.target, e.currentTarget);
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
        </div>,
        document.body
      )}
    </>
  );
}

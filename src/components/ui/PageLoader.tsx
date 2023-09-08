import { HashLoader } from 'react-spinners';

type Props = {
  label: string;
};

export default function PageLoader({ label }: Props) {
  return (
    <div className='fixed bg-gray-200 inset-0 z-20 bg-opacity-40 flex flex-col items-center justify-center gap-4'>
      <HashLoader />
      <p>{label}</p>
    </div>
  );
}

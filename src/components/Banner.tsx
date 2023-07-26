export type BannerData = {
  message: string;
  type: 'success' | 'error';
};

export default function Banner({ message, type }: BannerData) {
  return (
    <div className='mx-auto my-2 max-w-xl bg-green-100 py-2 px-6 rounded-lg transition-all'>
      {message}
      {type === 'success' && '✅'}
      {type === 'error' && '🔥'}
    </div>
  );
}

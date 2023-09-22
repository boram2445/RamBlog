import { AiFillHeart } from 'react-icons/ai';

type Props = {
  likes: number;
  className?: string;
};

export default function LikeNumIcon({ likes, className }: Props) {
  return (
    <div className={`flex gap-2 items-center ${className}`}>
      <AiFillHeart className='w-3 h-3 -mb-0.5' />
      <span className='text-sm'>{likes}</span>
    </div>
  );
}

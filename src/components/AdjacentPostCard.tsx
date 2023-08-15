import { Post } from '@/service/posts';
import Image from 'next/image';
import Link from 'next/link';
import { BsArrowLeftCircleFill, BsArrowRightCircleFill } from 'react-icons/bs';

type Props = {
  data: Post;
  type: 'prev' | 'next';
};

const ICON_CLASS = 'text-4xl group-hover:text-5xl transition-all';

export default function AdjacentPostCard({ data, type }: Props) {
  const { title, id, description } = data;
  return (
    <Link
      href={`/posts/${id}`}
      className='w-full max-h-40 relative cursor-pointer hover:shadow-lg'
    >
      {/* <Image
        src={`/images/posts/${path}.png`}
        alt={title}
        width={200}
        height={150}
        className='w-full h-full brightness-50'
      /> */}
      <div className='group w-full px-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-around items-center '>
        {type === 'prev' && <BsArrowLeftCircleFill className={ICON_CLASS} />}
        <div className='text-center'>
          <h4 className='text-xl font-bold'>{title}</h4>
          <p className='font-bold'>{description}</p>
        </div>
        {type === 'next' && <BsArrowRightCircleFill className={ICON_CLASS} />}
      </div>
    </Link>
  );
}

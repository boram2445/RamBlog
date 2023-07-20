import Image from 'next/image';
import { Post } from '@/service/posts';

export default function PostCard({ post }: { post: Post }) {
  const { title, description, date, category, path } = post;
  return (
    <article className='relative mx-auto w-full h-80 tablet:h-76 bg-white rounded-lg ease-in duration-100 cursor-pointer  hover:drop-shadow-md'>
      <div className='relative w-full h-3/5 '>
        <Image
          src={`/images/posts/${path}.png`}
          alt={`${title}이미지`}
          fill
          className='mx-auto rounded-t-lg'
        />
      </div>
      <div className='p-3'>
        <span className='py-0.5 px-2 bg-light-brown text-brown text-xs rounded-sm'>
          {category}
        </span>
        <h3 className='py-1 text-black font-semibold '>{title}</h3>
        <p className='text-sm text-dark-gray'>{description}</p>
        <small className='text-xs text-light-gray text-end absolute bottom-3 right-3'>
          {date}
        </small>
      </div>
    </article>
  );
}

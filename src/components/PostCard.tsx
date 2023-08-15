import Image from 'next/image';
import Link from 'next/link';
import { Post } from '@/service/posts';

export default function PostCard({ post }: { post: Post }) {
  const { title, description, tags, id } = post;
  return (
    <Link href={`/posts/${id}`}>
      <article className='relative mx-auto w-full h-80 tablet:h-76 bg-white rounded-lg overflow-hidden ease-in duration-100 cursor-pointer  hover:drop-shadow-md'>
        {/* <Image
          src={`/images/posts/${id}.png`}
          alt={`${title}이미지`}
          width={200}
          height={200}
          className='mx-auto w-full h-3/5'
        /> */}
        <div className='p-3'>
          <span className='py-0.5 px-2 bg-light-brown text-brown text-xs rounded-sm'>
            {tags.map((tag, index) => (
              <span key={index}>{tag}</span>
            ))}
          </span>
          <h3 className='py-1 text-black font-semibold '>{title}</h3>
          <p className='w-full text-sm text-dark-gray truncate'>
            {description}
          </p>
          <time className='text-xs text-dark-gray text-end absolute bottom-3 right-3'>
            {/* {date.toString()} */}
          </time>
        </div>
      </article>
    </Link>
  );
}

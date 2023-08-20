import Image from 'next/image';
import Link from 'next/link';
import { Post } from '@/service/posts';
import TagList from './ui/TagList';
import Date from './ui/Date';

export default function PostCard({ post }: { post: Post }) {
  const { title, description, tags, id, mainImage, createdAt } = post;

  return (
    <Link href={`/posts/${id}`}>
      <article className='relative mx-auto w-full h-80 tablet:h-76 overflow-hidden border-2 border-light-gray rounded-lg cursor-pointer  hover:drop-shadow-md'>
        {mainImage && (
          <Image
            src={mainImage}
            alt={`${title}이미지`}
            width={200}
            height={200}
            className='mx-auto w-full h-3/5 object-cover'
          />
        )}
        <div className='p-3'>
          <TagList tags={tags} />
          <h3 className='py-1 text-black font-semibold '>{title}</h3>
          <p className='w-full text-sm text-dark-gray truncate'>
            {description}
          </p>
          <div className='absolute bottom-4 right-4'>
            <Date date={createdAt.toString()} />
          </div>
        </div>
      </article>
    </Link>
  );
}

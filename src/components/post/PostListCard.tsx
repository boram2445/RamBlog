import { Post } from '@/service/posts';
import { useRouter } from 'next/navigation';
import TagList from '../common/TagList';
import Date from '../ui/Date';
import Image from 'next/image';

export default function PostListCard({ post }: { post: Post }) {
  const {
    title,
    description,
    tags,
    id,
    mainImage,
    createdAt,
    username,
    userImage,
  } = post;

  const router = useRouter();

  return (
    <article
      onClick={() => router.push(`/${username}/posts/${id}`)}
      className='py-6 px-12 flex justify-between border border-gray-100 rounded-full cursor-pointer hover:bg-gray-50'
    >
      <div className='flex flex-col'>
        <TagList tags={tags} />
        <h1 className='py-1 text-black text-lg tablet:text-2xl'>{title}</h1>
        <p className='mt-1 h-10 tablet:h-12 text-gray-400 truncate'>
          {description}
        </p>
        <Date date={createdAt?.toString()} />
      </div>
      {mainImage && (
        <Image
          src={mainImage}
          alt={`${title}이미지`}
          width={180}
          height={180}
          className='object-cover'
        />
      )}
    </article>
  );
}

import Image from 'next/image';
import Link from 'next/link';

type Props = {
  title: string;
  image: string;
  type: string;
  date: string;
  description: string;
  link: string;
};

export default function ProjectArticle({ project }: { project: Props }) {
  const { title, image, type, date, description, link } = project;

  return (
    <Link href={link} target='_blank'>
      <article className='p-2 grid grid-cols-[80px_140px_1fr] gap-4 items-center hover:shadow-md border border-light-gray rounded-lg cursor-pointer'>
        <div className='relative w-20 h-20'>
          <Image
            src={image}
            alt={`${title} 대표 이미지`}
            fill
            className='rounded-lg'
          />
        </div>
        <div>
          <h4 className=' text-lg font-semibold'>{title}</h4>
          <p className='text-sm'>{type}</p>
          <small className='text-xs'>{date}</small>
        </div>
        <p className='px-2 text-sm'>{description}</p>
      </article>
    </Link>
  );
}

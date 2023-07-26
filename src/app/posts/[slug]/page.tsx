import AdjacentPostCard from '@/components/AdjacentPostCard';
import MarkDownPost from '@/components/MarkDownPost';
import { getPostData } from '@/service/posts';
import Image from 'next/image';

type Props = {
  params: {
    slug: string;
  };
};

export default async function PostPage({ params: { slug } }: Props) {
  const { title, category, date, content, prev, next } = await getPostData(
    slug
  );

  return (
    <section className='max-w-screen-lg mx-auto p-8'>
      <div className='mt-8 mb-7 tablet:mx-5 pb-3 border-b border-brown'>
        <h2 className='mb-5 text-3xl font-semibold text-black'>{title}</h2>
        <div className='flex justify-between'>
          <span className='py-0.5 px-3 bg-light-brown text-brown text-xs border border-brown  rounded-lg '>
            {category}
          </span>
          <small className='text-sm text-dark-gray text-end bottom-3 right-3'>
            {date.toString()}
          </small>
        </div>
      </div>
      <div className='mx-auto px-4 tablet:px-8 laptop:px-16 desktop:px-20'>
        <Image
          src={`/images/posts/${slug}.png`}
          alt={`${title} 포스트 이미지`}
          width={500}
          height={320}
          className='mb-8 w-full h-1/6 max-h-96'
        />
        <MarkDownPost content={content} />
      </div>
      <div className='mt-32 flex'>
        {prev && <AdjacentPostCard data={prev} type='prev' />}
        {next && <AdjacentPostCard data={next} type='next' />}
      </div>
    </section>
  );
}

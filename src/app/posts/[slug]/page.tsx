import MarkDown from '@/components/MarkDown';
import { getMarkDown, getPost } from '@/service/posts';
import Image from 'next/image';

type Props = {
  params: {
    slug: string;
  };
};

export default async function PostPage({ params: { slug } }: Props) {
  const post = await getPost(slug); //가져올수 있는 다른 방법은 없을까?
  const text = await getMarkDown(slug);

  return (
    <section className='max-w-screen-lg mx-auto p-8'>
      <div className='mt-8 mb-7 tablet:mx-5 pb-3 border-b border-brown'>
        <h2 className='mb-5 text-3xl font-semibold text-black'>
          {post?.title}
        </h2>
        <div className='flex justify-between'>
          <span className='py-0.5 px-3 bg-light-brown text-brown text-xs border border-brown  rounded-lg '>
            {post?.category}
          </span>
          <small className='text-sm text-dark-gray text-end bottom-3 right-3'>
            {post?.date}
          </small>
        </div>
      </div>
      <div className='prose mx-auto'>
        <div className='w-full h-64 relative'>
          <Image
            src={`/images/posts/${slug}.png`}
            alt={`${post?.title} 포스트 이미지`}
            fill
          />
        </div>
        <MarkDown text={text} />
      </div>
    </section>
  );
}

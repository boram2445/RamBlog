'use client';

import { PostData } from '@/service/posts';
import Image from 'next/image';
import Link from 'next/link';
import useSWR from 'swr';
import MarkDownPost from './MarkDownPost';
import AdjacentPostCard from './AdjacentPostCard';

type Props = {
  id: string;
};

export default function PostDetail({ id }: Props) {
  //꼭 CSR로 받아와야 하는지 고민해보기
  const { data: post, isLoading, error } = useSWR<PostData>(`/api/posts/${id}`);

  if (!post) return null;

  return (
    <section className='max-w-screen-lg mx-auto p-8'>
      <div className='mt-8 mb-7 tablet:mx-5 pb-3 border-b border-brown'>
        <h2 className='mb-5 text-3xl font-semibold text-black'>{post.title}</h2>
        <div className='flex justify-between'>
          <span className='py-0.5 px-3 bg-light-brown text-brown text-xs border border-brown  rounded-lg '>
            {post?.tags.map((tag, index) => (
              <span key={index}>{tag}</span>
            ))}
          </span>
          <small className='text-sm text-dark-gray text-end bottom-3 right-3'>
            {/* {date.toString()} */}
          </small>
          <Link href={`/write/${id}`}>수정</Link>
        </div>
      </div>
      <div className='mx-auto px-4 tablet:px-8 laptop:px-16 desktop:px-20'>
        <Image
          src={post.mainImage}
          alt={`${post.title} 포스트 이미지`}
          width={500}
          height={320}
          className='mb-8 w-full h-1/6 max-h-96 object-cover'
        />
        <MarkDownPost content={post.content} />
      </div>
      <div className='mt-32 flex'>
        {post.prev && <AdjacentPostCard data={post.prev} type='prev' />}
        {post.next && <AdjacentPostCard data={post.next} type='next' />}
      </div>
    </section>
  );
}

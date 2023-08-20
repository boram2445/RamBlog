'use client';

import { PostData } from '@/service/posts';
import Image from 'next/image';
import Link from 'next/link';
import useSWR from 'swr';
import MarkDownPost from './MarkDownPost';
import AdjacentPostCard from './AdjacentPostCard';
import Button from './ui/Button';
import { AiFillEdit } from 'react-icons/ai';
import { ClipLoader } from 'react-spinners';
import TagList from './ui/TagList';
import Date from './ui/Date';
import axios from 'axios';
import { useRouter } from 'next/navigation';

type Props = {
  id: string;
};

export default function PostDetail({ id }: Props) {
  //꼭 CSR로 받아와야 하는지 고민해보기
  const { data: post, isLoading, error } = useSWR<PostData>(`/api/posts/${id}`);
  const router = useRouter();

  if (!post) return null;

  const handleDelete = () => {
    if (confirm('정말로 삭제하시겠습니까?😥')) {
      axios.delete(`/api/posts/${id}`).then(() => router.push('/'));
    }
  };

  return (
    <section className='max-w-screen-lg mx-auto p-8'>
      {isLoading && <ClipLoader color='green' />}
      {!isLoading && !error && (
        <>
          <div className='flex flex-col mt-8 mb-7 tablet:mx-5 pb-3 border-b '>
            <h2 className='mb-5 text-3xl font-semibold text-black'>
              {post.title}
            </h2>
            <div className='mb-2 flex justify-end gap-2'>
              <Link href={`/write/${id}`}>
                <Button>수정</Button>
              </Link>
              <Button onClick={handleDelete}>삭제</Button>
            </div>
            <div className='flex justify-between items-center'>
              {post.tags && <TagList tags={post.tags} type='big' />}
              <Date date={post.createdAt.toString()} type='big' />
            </div>
          </div>
          <div className='mx-auto px-4 tablet:px-8 laptop:px-16 desktop:px-20 min-h-[300px]'>
            <MarkDownPost content={post.content} />
          </div>
          <div className='mt-32 flex'>
            {post.prev && <AdjacentPostCard data={post.prev} type='prev' />}
            {post.next && <AdjacentPostCard data={post.next} type='next' />}
          </div>
        </>
      )}
    </section>
  );
}

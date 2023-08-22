import { PostData, getPostDetail } from '@/service/posts';
import Image from 'next/image';
import Link from 'next/link';
import useSWR from 'swr';
import MarkDownPost from './MarkDownPost';
import AdjacentPostCard from './AdjacentPostCard';
import Button from '../ui/Button';
import { ClipLoader } from 'react-spinners';
import TagList from '../ui/TagList';
import Date from '../ui/Date';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Toc from './Toc';
import PostButtonList from './PostButtonList';

type Props = {
  id: string;
};

export default async function PostDetail({ id }: Props) {
  const post = await getPostDetail(id);
  const { title, tags, createdAt, content, prev, next } = post;

  // const { data: post, isLoading, error } = useSWR<PostData>(`/api/posts/${id}`);
  // const router = useRouter();

  // if (!post) return null;

  return (
    <section className='max-w-screen-lg mx-auto p-8'>
      <>
        <div className='flex flex-col mt-8 mb-7 tablet:mx-5 pb-3 border-b '>
          <h1 className='mb-5 text-3xl font-semibold text-black'>{title}</h1>
          <PostButtonList id={id} />
          <div className='flex justify-between items-center'>
            {tags && <TagList tags={post.tags} type='big' />}
            <Date date={createdAt.toString()} type='big' />
          </div>
        </div>
        <div className='relative flex mx-auto px-4 tablet:px-8 laptop:px-16 desktop:px-20 min-h-[300px]'>
          <div className='flex-1'>
            <MarkDownPost content={content} />
          </div>
        </div>
        <div className='mt-32 flex'>
          {prev && <AdjacentPostCard data={prev} type='prev' />}
          {next && <AdjacentPostCard data={next} type='next' />}
        </div>
      </>
    </section>
  );
}

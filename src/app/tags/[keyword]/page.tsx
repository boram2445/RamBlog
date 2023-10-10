import TagPosts from '@/components/post/TagsPosts';
import { AiFillTag } from 'react-icons/ai';

type Props = {
  params: {
    keyword: string;
  };
};

export default function TagsPage({ params: { keyword } }: Props) {
  return (
    <section className='mx-auto max-w-3xl laptop:max-w-7xl my-10'>
      <h1 className='mb-8 pb-4 px-3 text-3xl laptop:text-4xl text-gray-800 font-bold border-b border-gray-200 flex items-center dark:border-neutral-700 dark:text-slate-300'>
        <AiFillTag className='-mb-3 mr-2' /> Tag - {decodeURIComponent(keyword)}
      </h1>
      <TagPosts tag={keyword} />
    </section>
  );
}

export function generateMetadata({ params: { keyword } }: Props) {
  const tag = decodeURIComponent(keyword);
  return {
    title: `#${tag} | RamBlog`,
    description: `${tag} 검색 결과`,
  };
}

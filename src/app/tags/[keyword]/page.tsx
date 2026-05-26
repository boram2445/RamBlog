import TagPosts from '@/components/post/TagsPosts';
import { AiFillTag } from 'react-icons/ai';

type Props = {
  params: Promise<{
    keyword: string;
  }>;
};

export default async function TagsPage(props: Props) {
  const params = await props.params;

  const {
    keyword
  } = params;

  return (
    <section className='mx-auto max-w-3xl laptop:max-w-7xl my-10'>
      <h1 className='mb-8 pb-4 px-3 text-3xl laptop:text-4xl text-gray-800 font-bold border-b border-gray-200 flex items-center dark:border-neutral-700 dark:text-slate-300'>
        <AiFillTag className='-mb-3 mr-2' /> Tag - {decodeURIComponent(keyword)}
      </h1>
      <TagPosts tag={keyword} />
    </section>
  );
}

export async function generateMetadata(props: Props) {
  const params = await props.params;

  const {
    keyword
  } = params;

  const tag = decodeURIComponent(keyword);
  return {
    title: `#${tag} | RamBlog`,
    description: `${tag} 검색 결과`,
  };
}

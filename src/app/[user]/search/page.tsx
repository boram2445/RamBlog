import SearchList from '@/components/search/SearchList';

type Props = {
  params: Promise<{
    user: string;
  }>;
};

export default async function SearchPage(props: Props) {
  const params = await props.params;

  const {
    user
  } = params;

  return (
    <div className='mx-auto max-w-3xl laptop:max-w-7xl my-10'>
      <SearchList slug={user} />
    </div>
  );
}

export async function generateMetadata(props: Props) {
  const params = await props.params;

  const {
    user
  } = params;

  return {
    title: `${user} / Search | RamBlog`,
    description: `${user} 블로그내 포스트 검색`,
  };
}

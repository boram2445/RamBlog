import SearchList from '@/components/search/SearchList';

type Props = {
  params: {
    user: string;
  };
};

export default function SearchPage({ params: { user } }: Props) {
  return (
    <>
      <SearchList username={user} />
    </>
  );
}

export function generateMetadata({ params: { user } }: Props) {
  return {
    title: `${user} / Search | RamBlog`,
    description: `${user} 블로그내 포스트 검색`,
  };
}

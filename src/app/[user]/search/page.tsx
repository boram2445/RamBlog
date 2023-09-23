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

import type { Metadata } from 'next';
import SearchList from '@/components/search/SearchList';

export const metadata: Metadata = {
  description: '포스트 및 유저 검색',
};

export default function SearchPage() {
  return (
    <>
      <SearchList />
    </>
  );
}

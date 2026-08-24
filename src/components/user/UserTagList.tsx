import { getTags } from '@/service/posts';
import TagList, { TagItem } from '../common/TagList';

type Props = {
  slug: string;
  selected: string;
};

export default async function UserTagList({ slug, selected }: Props) {
  const tags = await getTags(slug);

  // 태그 링크에 page를 싣지 않는다 — page가 URL에 없으면 서버가 1로 파싱하므로
  // 태그를 바꾸면 구조적으로 1페이지로 리셋된다.
  const items: TagItem[] = [
    { name: 'all', href: `/${slug}` },
    ...tags.map(({ name, count }) => ({
      name,
      count,
      href: `/${slug}?${new URLSearchParams({ tag: name })}`,
    })),
  ];

  return (
    <div className='px-3 tablet:px-6 pb-2'>
      <TagList tags={items} type='big' checked={selected} />
    </div>
  );
}

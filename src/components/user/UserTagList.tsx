'use client';

import useSWR from 'swr';
import TagList, { TagListLoading } from '../common/TagList';

type Props = {
  username: string;
  onClick: (tag: string) => void;
  selected: string;
};

export default function UserTagList({ username, onClick, selected }: Props) {
  const { data: tags, isLoading } = useSWR(`/api/${username}/posts/tags`);

  return (
    <div className='px-6 pb-2'>
      {isLoading && <TagListLoading type='big' />}
      {tags && (
        <TagList
          tags={['all', ...tags]}
          type='big'
          onClick={onClick}
          checked={selected}
        />
      )}
    </div>
  );
}

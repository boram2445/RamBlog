'use client';

import useSWR from 'swr';
import TagList from '../common/TagList';

type Props = {
  username: string;
  onClick: (tag: string) => void;
  selected: string;
};

export default function UserTagList({ username, onClick, selected }: Props) {
  const { data: tags } = useSWR(`/api/${username}/posts/tags`);

  return (
    <div className='px-6 mb-6'>
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

'use client';

import useUser from '@/hooks/useUser';
import UserCard from '../common/UserCard';
import MiniLoader from '../ui/MiniLoader';

type Props = {
  slug: string;
  type: 'follower' | 'following';
};

export default function FollowLists({ slug, type }: Props) {
  const { userProfile, isLoading, error } = useUser(slug);

  const list =
    type === 'follower' ? userProfile?.followers : userProfile?.following;
  const count = list?.length || '';

  return (
    <section className='mt-14'>
      <h1 className='mb-4 text-xl'>
        {type === 'follower' ? '팔로워' : '팔로잉'}
        <span className='text-pink-400 font-semibold'>
          {count ? ` ${count}` : ` 0`}
        </span>
        명
      </h1>
      {isLoading && <MiniLoader />}
      {!isLoading && !error && (
        <ul>
          {list?.map((item) => (
            <li key={item.id}>
              <UserCard followUser={item} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

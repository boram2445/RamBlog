'use client';

import useUser from '@/hooks/useUser';
import UserCard from '../common/UserCard';
import { ClipLoader } from 'react-spinners';

type Props = {
  username: string;
  type: 'follower' | 'following';
};

export default function FollowLists({ username, type }: Props) {
  const { userProfile, isLoading, error } = useUser(username);

  const list =
    type === 'follower' ? userProfile?.followers : userProfile?.following;
  const count = list?.length || 0;

  return (
    <section>
      <h1>
        {type === 'follower' ? '팔로워' : '팔로잉'}
        <span className='text-pink-400'>{` ${count}`}</span>명
      </h1>
      {isLoading && (
        <div>
          <ClipLoader />
        </div>
      )}
      {userProfile && (
        <ul>
          {list?.map((item) => (
            <li key={item.id}>
              <UserCard user={userProfile} followUser={item} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

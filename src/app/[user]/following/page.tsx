import FollowLists from '@/components/follow/FollowLists';

type Props = {
  params: {
    user: string;
  };
};

export default function FollowingPage({ params: { user } }: Props) {
  return (
    <div className='max-w-screen-md mx-auto px-6'>
      <FollowLists username={user} type='following' />
    </div>
  );
}

export function generateMetadata({ params: { user } }: Props) {
  return {
    title: `${user} / Following | RamBlog`,
    description: `${user}님을 팔로우 하는 유저 리스트`,
  };
}

import FollowLists from '@/components/follow/FollowLists';

type Props = {
  params: {
    user: string;
  };
};

export default function FollowerPage({ params: { user } }: Props) {
  return (
    <>
      <FollowLists username={user} type='follower' />
    </>
  );
}

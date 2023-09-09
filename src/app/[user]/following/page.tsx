import FollowLists from '@/components/follow/FollowLists';

type Props = {
  params: {
    user: string;
  };
};

export default function FollowingPage({ params: { user } }: Props) {
  return (
    <>
      <FollowLists username={user} type='following' />
    </>
  );
}

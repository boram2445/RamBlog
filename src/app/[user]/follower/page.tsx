import FollowLists from '@/components/follow/FollowLists';

type Props = {
  params: Promise<{
    user: string;
  }>;
};

export default async function FollowerPage(props: Props) {
  const params = await props.params;

  const {
    user
  } = params;

  return (
    <div className='max-w-screen-md mx-auto px-6'>
      <FollowLists slug={user} type='follower' />
    </div>
  );
}

export async function generateMetadata(props: Props) {
  const params = await props.params;

  const {
    user
  } = params;

  return {
    title: `${user} / Follower | RamBlog`,
    description: `${user}님이 팔로우 하는 유저 리스트`,
  };
}

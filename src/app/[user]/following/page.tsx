import FollowLists from '@/components/follow/FollowLists';

type Props = {
  params: Promise<{
    user: string;
  }>;
};

export default async function FollowingPage(props: Props) {
  const params = await props.params;

  const {
    user
  } = params;

  return (
    <div className='max-w-screen-md mx-auto px-6'>
      <FollowLists username={user} type='following' />
    </div>
  );
}

export async function generateMetadata(props: Props) {
  const params = await props.params;

  const {
    user
  } = params;

  return {
    title: `${user} / Following | RamBlog`,
    description: `${user}님을 팔로우 하는 유저 리스트`,
  };
}

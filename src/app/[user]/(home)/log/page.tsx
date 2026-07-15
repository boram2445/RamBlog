import LogList from '@/components/log/LogList';
import { getUserForProfile } from '@/service/user';

type Props = {
  params: Promise<{ user: string }>;
};

export default async function LogPage(props: Props) {
  const params = await props.params;

  const {
    user
  } = params;

  const profileUser = await getUserForProfile(user);

  return (
    <>
      <LogList slug={user} userId={profileUser?.id} />
    </>
  );
}

export async function generateMetadata(props: Props) {
  const params = await props.params;

  const {
    user
  } = params;

  return {
    title: `${user} / Logs | RamBlog`,
    description: `하루 감정 기록`,
  };
}

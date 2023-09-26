import LogList from '@/components/log/LogList';

type Props = {
  params: { user: string };
};

export default function LogPage({ params: { user } }: Props) {
  return (
    <>
      <LogList username={user} />
    </>
  );
}

export function generateMetadata({ params: { user } }: Props) {
  return {
    title: `${user} / Logs | RamBlog`,
    description: `하루 감정 기록`,
  };
}

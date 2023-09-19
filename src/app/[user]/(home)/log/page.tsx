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

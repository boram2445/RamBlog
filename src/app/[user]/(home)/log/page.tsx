import LogHero from '@/components/log/LogHero';
import LogList from '@/components/log/LogList';

type Props = {
  params: { user: string };
};

export default function LogPage({ params: { user } }: Props) {
  return (
    <>
      <LogHero username={user} />
      <LogList username={user} />
    </>
  );
}

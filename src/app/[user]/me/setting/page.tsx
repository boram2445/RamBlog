import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { getUserForProfile } from '@/service/user';
import { notFound } from 'next/navigation';
import ProfileForm from '@/components/setting/ProfileForm';
import Title from '@/components/ui/Title';

export default async function SettingPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) notFound();
  const userData = user && (await getUserForProfile(user.username));

  return (
    <section className='max-w-screen-md mx-auto p-5'>
      <div className='mb-8'>
        <Title
          title='프로필 수정'
          description='현재 프로필을 수정할수 있어요.'
        />
      </div>
      <ProfileForm userData={userData} />
    </section>
  );
}

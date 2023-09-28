import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { getUserForProfile } from '@/service/user';
import { redirect } from 'next/navigation';
import ProfileForm from '@/components/setting/ProfileForm';
import Title from '@/components/ui/Title';

export default async function SettingPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) redirect('/auth/signin');
  const userData = user && (await getUserForProfile(user.username));

  return (
    <section className='mt-12 mx-auto max-w-3xl laptop:max-w-5xl'>
      <div className='my-6'>
        <Title title='프로필 설정' description='현재 프로필을 수정해보세요' />
      </div>
      <ProfileForm userData={userData} />
    </section>
  );
}

import { auth } from '@/auth';
import { getUserForProfile } from '@/service/user';
import { redirect } from 'next/navigation';
import ProfileForm from '@/components/setting/ProfileForm';
import Title from '@/components/ui/Title';

export default async function SettingPage() {
  const session = await auth();
  const user = session?.user;

  if (!user) redirect('/auth/signin');
  const userData = await getUserForProfile(user.slug);
  if (!userData) redirect('/auth/signin');

  return (
    <section className='mt-12 mx-auto max-w-3xl laptop:max-w-5xl'>
      <div className='my-6'>
        <Title title='프로필 설정' description='현재 프로필을 수정해보세요' />
      </div>
      <ProfileForm userData={userData} />
    </section>
  );
}

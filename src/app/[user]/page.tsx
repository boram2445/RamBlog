import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import Hero from '@/components/home/Hero';
import PostList from '@/components/home/PostList';

export default async function UserPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  return (
    <div className='text-lg'>
      안녕{user?.username}
      <Hero />
      <PostList />
    </div>
  );
}

import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import BookmarkPosts from '@/components/bookmarks/BookmarkPosts';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/dist/server/api-utils';
import { BsFillBookmarkFill } from 'react-icons/bs';

type Props = {
  params: {
    user: string;
  };
};

export default async function BookmarksPage({ params: { user } }: Props) {
  const session = await getServerSession(authOptions);
  const loginUser = session?.user;

  if (!loginUser) redirect('/auth/signin');

  return (
    <section className='mx-auto max-w-3xl laptop:max-w-7xl my-10'>
      <h1 className='mb-8 pb-4 px-3 text-3xl laptop:text-4xl text-gray-800 font-bold border-b border-gray-200 flex items-center dark:border-neutral-700 dark:text-slate-300'>
        <BsFillBookmarkFill className='-mb-3 mr-2' /> My Bookmarks
      </h1>
      <BookmarkPosts username={user} />
    </section>
  );
}

import MarkDownPost from './MarkDownPost';
import AdjacentPostCard from './AdjacentPostCard';
import TagList, { TagListLoading } from '../common/TagList';
import Date from '../ui/Date';
import Toc from './Toc';
import PostButtonList from './PostButtonList';
import { AuthUser } from '@/model/user';
import UserAvartar, { UserAvartarLoading } from '../common/UserAvartar';
import { AdjacentPost, PostDetail as PostDetailType } from '@/model/post';
import PostIcons from './PostIcons';
import Skeleton from '../ui/Skeleton';
import PostUserProfile from './PostUserProfile';
import LikeNumIcon from '../common/LikeNumIcon';

type Props = {
  currentPost: PostDetailType;
  nextPost?: AdjacentPost;
  previousPost?: AdjacentPost;
  loginUserData?: AuthUser;
};

export default async function PostDetail({
  currentPost,
  nextPost,
  previousPost,
  loginUserData,
}: Props) {
  const { title, tags, createdAt, content, id, username, userImage, likes } =
    currentPost;

  const isMyPost = loginUserData?.username === username;

  return (
    <section className='pb-16 relative'>
      <div className='flex flex-col mt-11 mb-7 pb-3 border-b dark:border-slate-700'>
        {tags && (
          <div className='mb-3 flex justify-between items-center'>
            <TagList tags={currentPost.tags} type='big' />
          </div>
        )}
        <h1 className='mb-6 text-3xl tablet:text-4xl laptop:text-[42px] font-semibold text-gray-800 dark:text-slate-200'>
          {title}
        </h1>
        <div className='flex justify-between'>
          <div className='flex gap-4'>
            <UserAvartar
              imageUrl={userImage}
              username={username}
              size='small'
            />
            <Date date={createdAt?.toString()} type='small' />
            <LikeNumIcon
              likes={likes?.length ?? 0}
              className='text-gray-700 dark:text-slate-400'
            />
          </div>
          {isMyPost && <PostButtonList id={id} username={username} />}
        </div>
      </div>
      <div className='flex mx-auto min-h-[300px] laptop:gap-12 pb-12'>
        <div className='grow pb-5 ' id='content'>
          <MarkDownPost content={content} />
        </div>
        <div className='mt-8 ml-auto'>
          <aside className='sticky top-[120px] hidden min-w-[230px] max-w-[250px] laptop:block border border-gray-200 rounded-xl overflow-hidden dark:bg-neutral-800 dark:border-neutral-700'>
            <Toc />
            <PostIcons post={currentPost} />
          </aside>
        </div>
      </div>
      {tags && (
        <div className='flex justify-between items-center pb-2 border-b border-gray-200 dark:border-slate-700'>
          <TagList tags={currentPost.tags} type='big' />
        </div>
      )}
      <PostUserProfile username={username} />
      <div className='laptop:hidden my-2 border border-gray-200 dark:border-neutral-700 rounded-xl overflow-hidden'>
        <PostIcons post={currentPost} />
      </div>
      {(previousPost || nextPost) && (
        <div className='mx-auto mt-5 px-4 flex gap-4 flex-col laptop:flex-row'>
          {previousPost && <AdjacentPostCard data={previousPost} type='prev' />}
          {nextPost && <AdjacentPostCard data={nextPost} type='next' />}
        </div>
      )}
    </section>
  );
}

export function PostDetailLoading() {
  return (
    <section className='pb-16 relative '>
      <div className='flex flex-col mt-8 mb-7 pb-3 border-b '>
        <TagListLoading type='big' />
        <Skeleton className='mb-6 mt-4 w-2/3 h-[3rem]' />
        <div className='flex justify-between'>
          <div className='flex gap-4 items-center'>
            <UserAvartarLoading size='small' />
            <Skeleton className='w-[10rem] h-[1.5rem]' />
          </div>
        </div>
      </div>
    </section>
  );
}

import MarkDownPost from './MarkDownPost';
import AdjacentPostCard from './AdjacentPostCard';
import TagList from '../common/TagList';
import Date from '../ui/Date';
import Toc from './Toc';
import PostButtonList from './PostButtonList';
import { AuthUser } from '@/model/user';
import UserAvartar from '../common/UserAvartar';
import { AdjacentPost, PostDetail as PostDeetailType } from '@/model/post';

type Props = {
  currentPost: PostDeetailType;
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
  const { title, tags, createdAt, content, id, username, userImage } =
    currentPost;

  const isMyPost = loginUserData?.username === username;

  return (
    <section>
      <div className='flex flex-col mt-8 mb-7 tablet:mx-5 pb-3 border-b '>
        <div className='mb-2 flex justify-between'>
          {tags && <TagList tags={currentPost.tags} type='small' />}
          {isMyPost && <PostButtonList id={id} username={username} />}
        </div>
        <h1 className='mb-6 text-4xl font-semibold text-black'>{title}</h1>
        <div className='flex gap-4'>
          <UserAvartar imageUrl={userImage} username={username} size='small' />
          <Date date={createdAt?.toString()} type='small' />
        </div>
      </div>
      <div className='relative flex mx-auto px-4 tablet:px-8 laptop:px-16 desktop:px-20 min-h-[300px]'>
        <div className='flex-1'>
          <MarkDownPost content={content} />
        </div>
      </div>
      <div className='mx-auto px-4 mt-32 mb-12 flex gap-4 flex-col laptop:flex-row'>
        {previousPost && <AdjacentPostCard data={previousPost} type='prev' />}
        {nextPost && <AdjacentPostCard data={nextPost} type='next' />}
      </div>
    </section>
  );
}

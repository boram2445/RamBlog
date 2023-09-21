import MarkDownPost from './MarkDownPost';
import AdjacentPostCard from './AdjacentPostCard';
import TagList from '../common/TagList';
import Date from '../ui/Date';
import Toc from './Toc';
import PostButtonList from './PostButtonList';
import { AuthUser } from '@/model/user';
import UserAvartar from '../common/UserAvartar';
import { AdjacentPost, PostDetail as PostDetailType } from '@/model/post';
import PostIcons from './PostIcons';

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
  const { title, tags, createdAt, content, id, username, userImage } =
    currentPost;

  const isMyPost = loginUserData?.username === username;

  return (
    <section className='pb-16 relative '>
      <div className='flex flex-col mt-8 mb-7 pb-3 border-b '>
        {tags && (
          <div className='mb-4 flex justify-between items-center'>
            <TagList tags={currentPost.tags} type='big' />
          </div>
        )}
        <h1 className='mb-6 text-[42px] font-semibold text-gray-800'>
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
          </div>
          {isMyPost && <PostButtonList id={id} username={username} />}
        </div>
      </div>
      <div className='flex mx-auto min-h-[300px] gap-8'>
        <div className='grow' id='content'>
          <MarkDownPost content={content} />
        </div>
        <div className='mt-8 ml-auto'>
          <aside className='sticky top-[120px] hidden min-w-[230px] max-w-[250px] self-start laptop:block border border-gray-200 rounded-xl overflow-hidden'>
            <Toc />
            <PostIcons post={currentPost} />
          </aside>
        </div>
      </div>
      {(previousPost || nextPost) && (
        <div className='mx-auto px-4 mt-32 flex gap-4 flex-col laptop:flex-row'>
          {previousPost && <AdjacentPostCard data={previousPost} type='prev' />}
          {nextPost && <AdjacentPostCard data={nextPost} type='next' />}
        </div>
      )}
    </section>
  );
}

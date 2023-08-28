import { PostData } from '@/service/posts';
import MarkDownPost from './MarkDownPost';
import AdjacentPostCard from './AdjacentPostCard';
import TagList from '../common/TagList';
import Date from '../ui/Date';
import Toc from './Toc';
import PostButtonList from './PostButtonList';
import { AuthUser } from '@/model/user';
import UserAvartar from '../common/UserAvartar';

type Props = {
  post: PostData;
  loginUserData?: AuthUser;
};

export default async function PostDetail({ post, loginUserData }: Props) {
  const {
    title,
    tags,
    createdAt,
    content,
    prev,
    next,
    id,
    username,
    userImage,
  } = post;

  const isMyPost = loginUserData?.username === username;

  return (
    <section>
      <div className='flex flex-col mt-8 mb-7 tablet:mx-5 pb-3 border-b '>
        <h2 className='mb-5 text-3xl font-semibold text-black'>{title}</h2>
        {isMyPost && <PostButtonList id={id} username={username} />}
        {!isMyPost && (
          <div className='flex justify-end'>
            <UserAvartar
              imageUrl={userImage}
              username={username}
              type='medium'
            />
          </div>
        )}
        <div className='mt-2 flex justify-between items-center'>
          {tags && <TagList tags={post.tags} type='big' />}
          <Date date={createdAt.toString()} type='big' />
        </div>
      </div>
      <div className='relative flex mx-auto px-4 tablet:px-8 laptop:px-16 desktop:px-20 min-h-[300px]'>
        <div className='flex-1'>
          <MarkDownPost content={content} />
        </div>
      </div>
      <div className='mt-32 flex'>
        {prev && <AdjacentPostCard data={prev} type='prev' />}
        {next && <AdjacentPostCard data={next} type='next' />}
      </div>
    </section>
  );
}

import { SimplePost } from '@/model/post';
import PostListCard, { PostListCardLoading } from './PostListCard';
import NoContent from '../ui/NoContent';

type Props = {
  posts: SimplePost[];
};

export default function PostList({ posts }: Props) {
  if (posts.length === 0) {
    return <NoContent text='아직 등록된 포스트가 없어요😥' />;
  }

  return (
    <ul className='flex flex-col'>
      {posts.map((post) => (
        <li key={post.id}>
          <PostListCard post={post} />
        </li>
      ))}
    </ul>
  );
}

export function PostListLoading() {
  return (
    <ul>
      {Array.from({ length: 2 }, (_, index) => (
        <PostListCardLoading key={index} />
      ))}
    </ul>
  );
}

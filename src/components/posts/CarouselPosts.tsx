import { Post } from '@/service/posts';
import MultiCarousel from '../common/MultiCarousel';
import PostCard from '../common/PostCard';

type Props = {
  posts: Post[];
};

export default async function CarouselPosts({ posts }: Props) {
  if (!posts) return null;
  return (
    <MultiCarousel>
      {posts.map((post, index) => (
        <PostCard key={index} post={post} />
      ))}
    </MultiCarousel>
  );
}

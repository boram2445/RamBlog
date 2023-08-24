import { Post } from '@/service/posts';
import MultiCarousel from '../ui/MultiCarousel';
import PostCard from '../ui/PostCard';

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

import { SimplePost } from '@/model/post';
import MultiCarousel from '../common/MultiCarousel';
import PostCard from '../post/PostCard';

type Props = {
  posts: SimplePost[];
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

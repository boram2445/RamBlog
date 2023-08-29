import { Comment as CommentType } from '@/service/posts';
import Comment from './Comment';

type Props = {
  comments: CommentType[];
};

export default function CommentList({ comments }: Props) {
  return (
    <ul className='mt-4 flex flex-col gap-3'>
      {comments.map((comment) => (
        <li key={comment.id}>
          <Comment comment={comment} />
        </li>
      ))}
    </ul>
  );
}

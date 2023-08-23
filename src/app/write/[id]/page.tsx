import WritePostForm from '@/components/post/WritePostForm';
import { getPostDetail } from '@/service/posts';

type Props = {
  params: {
    id: string;
  };
};

export const dynamic = 'force-dynamic';

export default async function EditPage({ params: { id } }: Props) {
  const postDetail = await getPostDetail(id);

  return (
    <>
      <WritePostForm id={id} postDetail={postDetail} />
    </>
  );
}

import WritePostForm from '@/components/WritePostForm';
import { getPostDetail } from '@/service/posts';

type Props = {
  params: {
    id: string;
  };
};

export const dynamic = 'force-dynamic';

export default async function Page({ params: { id } }: Props) {
  const postDetail = await getPostDetail(id);

  return (
    <section>
      <WritePostForm id={id} postDetail={postDetail} />
    </section>
  );
}

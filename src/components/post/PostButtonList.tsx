'use client';

import Link from 'next/link';
import Button from '../ui/Button';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function PostButtonList({ id }: { id: string }) {
  const router = useRouter();

  const handleDelete = () => {
    if (confirm('정말로 삭제하시겠습니까?😥')) {
      axios.delete(`/api/posts/${id}`).then(() => router.push('/'));
    }
  };

  return (
    <div className='mb-2 flex justify-end gap-2'>
      <Link href={`/write/${id}`} prefetch={false}>
        <Button>수정</Button>
      </Link>
      <Button onClick={handleDelete}>삭제</Button>
    </div>
  );
}

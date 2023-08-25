'use client';

import Link from 'next/link';
import Button from '../ui/Button';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useState, useTransition } from 'react';
import { HashLoader } from 'react-spinners';

export default function PostButtonList({
  id,
  username,
}: {
  id: string;
  username: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState('');

  const isMutating = isFetching || isPending;

  const handleDelete = async () => {
    if (confirm('정말로 삭제하시겠습니까?😥')) {
      setIsFetching(true);
      await axios
        .delete(`/api/posts/${id}`)
        .catch((err) => setError(err.toString()));
      setIsFetching(false);
      startTransition(() => {
        router.refresh();
        router.push(`/${username}`);
      });
    }
  };

  return (
    <>
      {isMutating && (
        <div className='absolute bg-gray-200 inset-0 z-20 bg-opacity-40 flex flex-col items-center justify-center gap-4'>
          <HashLoader />
          <p>삭제중...</p>
        </div>
      )}
      <div className='mb-2 flex justify-end gap-2'>
        <Link href={`/write/${id}`} prefetch={false}>
          <Button>수정</Button>
        </Link>
        <Button onClick={handleDelete}>삭제</Button>
      </div>
    </>
  );
}

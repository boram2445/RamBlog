'use client';

import Link from 'next/link';
import Button from '../ui/Button';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useState, useTransition } from 'react';
import { HashLoader } from 'react-spinners';
import PageLoader from '../ui/PageLoader';

export default function PostButtonList({
  id,
  slug,
}: {
  id: string;
  slug: string;
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
        router.push(`/${slug}`);
      });
    }
  };

  return (
    <>
      {isMutating && <PageLoader label='삭제중...' />}
      <div className='ml-auto flex justify-end items-center gap-2'>
        <Link href={`/write/${id}`} prefetch={false}>
          <Button>수정</Button>
        </Link>
        <Button onClick={handleDelete}>삭제</Button>
      </div>
    </>
  );
}

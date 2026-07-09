'use client';

import { RiCloseLine } from 'react-icons/ri';
import Button from '../ui/Button';
import { ChangeEvent, FormEvent, useState } from 'react';
import useComment from '@/hooks/useComment';

type Props = {
  setForm: (close: boolean) => void;
  postId: string;
  parentCommentId?: string;
  commentId: string;
};

export default function PasswordForm({
  setForm,
  postId,
  parentCommentId,
  commentId,
}: Props) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { deleteComment } = useComment(postId);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (confirm('정말 댓글을 삭제하시겠습니까?😥')) {
      await deleteComment(commentId, parentCommentId, password)
        .then(() => setForm(false))
        .catch(() => setError('비밀번호가 일치하지 않습니다.'));
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='px-5 absolute inset-0 rounded-lg border border-gray-200 bg-white flex flex-col justify-center animate-wiggle'
    >
      <button onClick={() => setForm(false)} className='absolute top-3 right-3'>
        <RiCloseLine size='24' />
      </button>
      <label htmlFor='password'>비밀번호를 입력해주세요</label>
      <div className='mt-2 flex gap-3'>
        <input
          type='password'
          id='password'
          placeholder='비밀번호'
          className='rounded-lg border border-gray-200 px-5'
          onChange={handleChange}
          value={password}
          required
        />
        <Button color='black' type='submit'>
          입력
        </Button>
      </div>
      <p>{error && '비밀번호가 틀렸습니다'}</p>
    </form>
  );
}

'use client';

import { RiCloseLine } from 'react-icons/ri';
import Button from '../ui/Button';
import { ChangeEvent, FormEvent, useState } from 'react';
import axios from 'axios';

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
  const [error, setError] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const data = {
      parentCommentId,
      commentId,
      password,
    };
    const passwordMatch = await axios
      .post(`/api/comment/${postId}/password`, data)
      .catch(() => setError(true));

    if (passwordMatch) {
      //댓글 제거
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='px-5 absolute inset-0 bg-pink-200 flex flex-col justify-center'
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
          className='rounded-lg border border-gray-200 px-3'
          onChange={handleChange}
          value={password}
          required
        />
        <Button color='black'>입력</Button>
      </div>
      <p>{error && '비밀번호가 틀렸습니다'}</p>
    </form>
  );
}

'use client';

import { useSession } from 'next-auth/react';
import Button from '../ui/Button';
import { ChangeEvent, useState } from 'react';
import axios from 'axios';

type Props = {
  postId: string;
};

const inputStyle = 'p-2 border border-gray-300 rounded-lg placeholder:text-sm';

export default function CommentForm({ postId }: Props) {
  const { data: session } = useSession();
  const user = session?.user;

  const [form, setForm] = useState(initialState);
  const [error, setError] = useState('');

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!form.text) {
      alert('작성할 댓글을 입력해주세요😊');
      return;
    }
    let data;
    if (user) {
      data = { type: 'loggedInUserComment', text: form.text };
    } else {
      if (!form.guestName) {
        alert('이름을 입력해 주세요😊');
        return;
      } else if (!form.gusetPassword) {
        alert('댓글 입력을 위한 비밀번호를 입력해주세요😊');
        return;
      }
      data = {
        type: 'guestComment',
        text: form.text,
        name: form.guestName,
        password: form.gusetPassword,
      };
    }
    axios
      .post(`/api/comment/${postId}`, data)
      .then(() => {})
      .catch((err) => setError(err.toString()))
      .finally(() => setForm(initialState));
  };

  return (
    <div>
      <textarea
        name='text'
        placeholder='여러분의 소중한 댓글을 입력해주세요'
        className={`w-full h-28 ${inputStyle}`}
        onChange={handleChange}
        value={form.text}
      />
      <div className={`flex ${user ? 'justify-end' : 'justify-between'}`}>
        {!user && (
          <div className='flex gap-2'>
            <input
              name='guestName'
              type='text'
              placeholder='이름'
              className={inputStyle}
              onChange={handleChange}
              value={form.guestName}
            />
            <input
              name='gusetPassword'
              type='password'
              placeholder='댓글 비밀번호'
              className={inputStyle}
              onChange={handleChange}
              value={form.gusetPassword}
            />
            <Button>간편 로그인</Button>
          </div>
        )}
        <Button color='black' onClick={handleSubmit}>
          등록
        </Button>
      </div>
    </div>
  );
}

const initialState = {
  text: '',
  guestName: '',
  gusetPassword: '',
};

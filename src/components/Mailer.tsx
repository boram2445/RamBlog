'use client';

import { useEffect, useState } from 'react';

export default function Mailer() {
  const [form, setForm] = useState(initialValue);
  const [alert, setAlert] = useState(false);

  useEffect(() => {
    alert && setTimeout(() => setAlert(false), 3000);
  }, [alert]);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    console.log(form);
    setAlert(true);
  };

  const handleChange = (e: React.ChangeEvent) => {
    const { name, value } = e.target; //왜 오류가 나지
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      {alert && (
        <div className='mx-auto my-2 max-w-xl bg-green-100 py-2 px-6 rounded-lg ease-in duration-75'>
          메일을 성공적으로 보냈습니다✅
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className='mx-auto flex flex-col gap-3 max-w-xl px-5 py-8 bg-white-gray rounded-xl'
      >
        <input
          onChange={handleChange}
          value={form.email}
          type='email'
          name='email'
          required
          placeholder='보내는 사람 이메일'
          className='py-1.5 px-3 rounded-lg'
        />
        <input
          onChange={handleChange}
          value={form.title}
          type='text'
          name='title'
          required
          placeholder='메일 제목'
          className='py-1.5 px-3 rounded-lg'
        />
        <textarea
          onChange={handleChange}
          value={form.message}
          required
          name='message'
          placeholder='내용'
          className='py-1.5 px-3 h-48 rounded-lg'
        />
        <button className='border border-brown text-brown rounded-full py-1.5 font-semibold bg-white-brown hover:bg-brown hover:text-white ease-in duration-100'>
          Send
        </button>
      </form>
    </div>
  );
}

const initialValue = {
  email: '',
  title: '',
  message: '',
};

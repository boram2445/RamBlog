'use client';

import { IoIosArrowBack } from 'react-icons/io';
import Button from '../ui/Button';
import { ChangeEvent, FormEvent, useState } from 'react';
import { registerValidate } from '@/utils/validate';
import axios from 'axios';
import { useRouter } from 'next/navigation';

type Props = {
  closeForm: () => void;
};

const inputBoxStyle = 'flex flex-col gap-1';

export default function RegisterForm({ closeForm }: Props) {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState(initialState);
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const errors = registerValidate(form);
    if (errors.name || errors.username || errors.email || errors.password) {
      setError(errors);
      return;
    }

    axios
      .post('/api/auth/register', form)
      .then(() => {
        alert('회원가입이 완료되었습니다😊'); //알림 컴포넌트 만들어야 함
        router.push('/auth/signin');
      })
      .catch((err) =>
        setError((prev) => ({
          ...prev,
          ['username']: err.response.data.username,
          ['email']: err.response.data.email,
        }))
      );
  };

  return (
    <section className='absolute bg-white inset-0'>
      <button
        onClick={closeForm}
        className='p-2 rounded-full border border-gray-300'
      >
        <IoIosArrowBack />
      </button>
      <h1 className='mb-7 text-gray-800 text-3xl font-semibold py-4'>
        Sign up to RamBlog
      </h1>
      <form className='mb-4 flex flex-col gap-5'>
        <div className='flex gap-2'>
          <div className={inputBoxStyle}>
            <label htmlFor='name'>Name</label>
            <input
              type='text'
              name='name'
              id='name'
              className='input p-2'
              autoComplete='off'
              onChange={handleChange}
            />
            {error.name && (
              <small className='text-rose-500'>{`*${error.name}`}</small>
            )}
          </div>
          <div className={inputBoxStyle}>
            <label htmlFor='username'>Username (ID)</label>
            <input
              type='text'
              name='username'
              id='username'
              className='input p-2'
              autoComplete='off'
              onChange={handleChange}
            />
            {error.username && (
              <small className='text-rose-500'>{`*${error.username}`}</small>
            )}
          </div>
        </div>
        <div className={inputBoxStyle}>
          <label htmlFor='email'>Email</label>
          <input
            type='email'
            name='email'
            id='email'
            className='input p-2'
            autoComplete='off'
            onChange={handleChange}
          />
          {error.email && (
            <small className='text-rose-500'>{`*${error.email}`}</small>
          )}
        </div>
        <div className={`mb-3 ${inputBoxStyle}`}>
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            name='password'
            id='password'
            className='input p-2'
            onChange={handleChange}
          />
          {error.password && (
            <small className='text-rose-500'>{`*${error.password}`}</small>
          )}
        </div>
        <Button color='black' size='max' onClick={handleSubmit}>
          Create Account
        </Button>
      </form>
    </section>
  );
}

const initialState = {
  name: '',
  username: '',
  email: '',
  password: '',
};

'use client';

import { ChangeEvent, FormEvent, useState } from 'react';
import Button from '../ui/Button';
import loginValidate from '@/utils/validate';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const inputBoxStyle = 'flex flex-col gap-1';

export default function SigninForm() {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState({ email: '', password: '' });
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const errors = loginValidate(form);
    if (errors.email || errors.password) {
      setError(errors);
      return;
    }

    const status = await signIn('credentials', {
      redirect: false,
      email: form.email,
      password: form.password,
    });

    if (status?.error) {
      alert(status.error);
    } else if (status?.ok) {
      router.push('/');
    }
  };

  return (
    <form className='mb-4 flex flex-col gap-5'>
      <div className={inputBoxStyle}>
        <label htmlFor='email'>Email</label>
        <input
          type='email'
          name='email'
          id='email'
          className='input p-2'
          onChange={handleChange}
          autoComplete='off'
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
          autoComplete='off'
          onChange={handleChange}
        />
        {error.password && (
          <small className='text-rose-500'>{`*${error.password}`}</small>
        )}
      </div>
      <Button color='black' size='max' onClick={handleSubmit}>
        Sign In
      </Button>
    </form>
  );
}

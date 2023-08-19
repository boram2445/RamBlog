'use client';

import { ChangeEvent, FormEvent, useState } from 'react';
import { EmailData } from '@/service/email';
import Banner, { BannerData } from './Banner';
import { sendContactEmail } from '@/service/contact';

export default function ContactForm() {
  const [form, setForm] = useState<EmailData>(initialValue);
  const [banner, setBanner] = useState<BannerData | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendContactEmail(form)
      .then(() => {
        setBanner({ message: '메일을 성공적으로 보냈습니다', type: 'success' });
        setForm(initialValue);
      })
      .catch(() =>
        setBanner({ message: '메일 전송에 실패했습니다', type: 'error' })
      )
      .finally(() => setTimeout(() => setBanner(null), 3000));
  };

  return (
    <div>
      {banner && <Banner message={banner.message} type={banner.type} />}
      <form
        onSubmit={handleSubmit}
        className='mx-auto flex flex-col gap-3 max-w-xl px-5 py-8 bg-white-gray rounded-xl'
      >
        <input
          onChange={handleChange}
          value={form.from}
          type='email'
          name='from'
          placeholder='보내는 사람 이메일'
          className='py-1.5 px-3 rounded-lg'
          required
        />
        <input
          onChange={handleChange}
          value={form.subject}
          type='text'
          name='subject'
          placeholder='메일 제목'
          className='py-1.5 px-3 rounded-lg'
          required
        />
        <textarea
          onChange={handleChange}
          value={form.message}
          name='message'
          placeholder='내용'
          className='py-1.5 px-3 h-48 rounded-lg'
          required
        />
        <button className=' rounded-full py-1.5 font-semibold hover:text-white ease-in duration-100'>
          Send
        </button>
      </form>
    </div>
  );
}

const initialValue = {
  from: '',
  subject: '',
  message: '',
};

'use client';

import { ChangeEvent, useRef, useState } from 'react';
import TuiEditors from './TuiEditors';
import { Editor } from '@toast-ui/react-editor';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { PostData } from '@/service/posts';

type Props = {
  id?: string;
  postDetail?: PostData;
};

export default function WritePostForm({ id, postDetail }: Props) {
  const editorRef = useRef<Editor | null>(null);
  const initialState = {
    title: postDetail?.title || '',
    description: postDetail?.description || '',
    tags: postDetail?.tags.join(', ') || '',
  };

  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const content = editorRef.current?.getInstance().getMarkdown();

    if (!content || !form.title || !form.tags || !form.description) {
      alert('모든 항목을 입력해 주세요');
      return;
    }
    setLoading(true);
    const data = { ...form, content };
    axios
      .post('/api/posts', data)
      .then(() => router.push('/'))
      .catch((err) => setError(err.toString()))
      .finally(() => setLoading(false));
  };

  return (
    <div className='flex flex-col'>
      <div>
        <label htmlFor='title'>제목</label>
        <input
          type='text'
          id='title'
          name='title'
          placeholder='제목을 입력해주세요'
          autoFocus
          value={form.title}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor='description'>설명</label>
        <input
          type='text'
          id='description'
          name='description'
          placeholder='한줄 설명을 입력해주세요'
          value={form.description}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor='tags'>태그</label>
        <input
          type='text'
          id='tags'
          name='tags'
          placeholder='태그를 입력해주세요'
          value={form.tags}
          onChange={handleChange}
        />
      </div>
      <TuiEditors content={postDetail?.content || ' '} editorRef={editorRef} />
      <button onClick={handleSubmit} className='bg-pink-200'>
        {id ? '수정완료' : '저장하기'}
      </button>
    </div>
  );
}

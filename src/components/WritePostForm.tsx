'use client';

import { ChangeEvent, useRef, useState } from 'react';
import TuiEditors from './TuiEditors';
import { Editor } from '@toast-ui/react-editor';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { PostData } from '@/service/posts';
import Button from './ui/Button';

type Props = {
  id?: string;
  postDetail?: PostData;
};

const inputBoxStyle = 'flex gap-2 items-center';
const inputStyle =
  'grow my-1 py-2 px-3 border border-gray-200 bg-gray-50 rounded-md';

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

    const url = getMainImageUrl(content);

    setLoading(true);
    const formData = new FormData();
    formData.append('mainImageUrl', url);
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('tags', form.tags);
    formData.append('content', content);

    console.log(url);

    axios
      .post('/api/posts', formData)
      .then(() => router.push('/'))
      .catch((err) => setError(err.toString()))
      .finally(() => setLoading(false));
  };

  const handleEdit = () => {
    const content = editorRef.current?.getInstance().getMarkdown();

    const url = getMainImageUrl(content);

    const formData = new FormData();
    postDetail?.mainImage !== url && formData.append('mainImageUrl', url);
    postDetail?.title !== form.title && formData.append('title', form.title);
    postDetail?.description !== form.description &&
      formData.append('description', form.description);
    postDetail?.tags.join(', ') !== form.tags &&
      formData.append('tags', form.tags);
    postDetail?.content !== content && formData.append('content', content);

    axios
      .patch(`/api/posts/${id}`, formData)
      .then(() => router.push('/'))
      .catch((err) => setError(err.toString()))
      .finally(() => setLoading(false));
  };

  return (
    <div className='flex flex-col'>
      <div className='my-3 mx-auto max-w-screen-lg w-full px-4'>
        <div className={inputBoxStyle}>
          <label htmlFor='title'>제목</label>
          <input
            type='text'
            id='title'
            name='title'
            placeholder='제목을 입력하세요'
            autoFocus
            value={form.title}
            onChange={handleChange}
            className={inputStyle}
            autoComplete='off'
          />
        </div>
        <div className={inputBoxStyle}>
          <label htmlFor='description'>설명</label>
          <input
            type='text'
            id='description'
            name='description'
            placeholder='한줄 설명을 입력해주세요'
            value={form.description}
            onChange={handleChange}
            className={inputStyle}
            autoComplete='off'
          />
        </div>
        <div className={inputBoxStyle}>
          <label htmlFor='tags'>태그</label>
          <input
            type='text'
            id='tags'
            name='tags'
            placeholder='태그를 입력해주세요'
            value={form.tags}
            onChange={handleChange}
            className={inputStyle}
            autoComplete='off'
          />
        </div>
      </div>
      <TuiEditors content={postDetail?.content || ' '} editorRef={editorRef} />
      <div className='m-3 mx-4 laptop:mx-8 desktop:mx-12 flex justify-end gap-3'>
        <Button onClick={() => router.back()}>뒤로가기</Button>
        <Button color='black' onClick={postDetail ? handleEdit : handleSubmit}>
          출간하기
        </Button>
      </div>
    </div>
  );
}

const getMainImageUrl = (content: string) => {
  const urlRegex = /!\[.*?\]\((https?:\/\/\S+)\)/;
  const match = content.match(urlRegex);
  return match?.[1] || '';
};

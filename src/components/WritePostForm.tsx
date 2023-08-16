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
  const [file, setFile] = useState<File>();

  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = e.target?.files;
    if (files && files[0]) {
      setFile(files[0]);
    }
  };

  const handleSubmit = () => {
    const content = editorRef.current?.getInstance().getMarkdown();

    if (!content || !form.title || !form.tags || !form.description || !file) {
      alert('모든 항목을 입력해 주세요');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('tags', form.tags);
    formData.append('content', content);

    axios
      .post('/api/posts', formData)
      .then(() => router.push('/'))
      .catch((err) => setError(err.toString()))
      .finally(() => setLoading(false));
  };

  const handleEdit = () => {
    const content = editorRef.current?.getInstance().getMarkdown();

    const formData = new FormData();
    postDetail?.title !== form.title && formData.append('title', form.title);
    postDetail?.description !== form.description &&
      formData.append('description', form.description);
    postDetail?.tags.join(', ') !== form.tags &&
      formData.append('tags', form.tags);
    postDetail?.content !== content && formData.append('content', content);
    file && formData.append('file', file);

    axios
      .patch(`/api/posts/${id}`, formData)
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
        <label htmlFor='mainImage'>메인 이미지</label>
        <input
          type='file'
          id='mainImage'
          name='mainImage'
          accept='image/*'
          onChange={handleFileChange}
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
      <button
        onClick={postDetail ? handleEdit : handleSubmit}
        className='bg-pink-200'
      >
        {id ? '수정완료' : '저장하기'}
      </button>
    </div>
  );
}

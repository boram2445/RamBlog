'use client';

import { ChangeEvent, useRef, useState, useTransition } from 'react';
import TuiEditors from './TuiEditors';
import { Editor } from '@toast-ui/react-editor';
import { useRouter } from 'next/navigation';
import { PostDetail } from '@/model/post';
import Button from '../ui/Button';
import TagsInput from './TagsInput';
import useUserPost from '@/hooks/useUserPost';
import PageLoader from '../ui/PageLoader';

type Props = {
  username: string;
  id?: string;
  postDetail?: PostDetail;
};

const inputBoxStyle = 'flex gap-2 items-center';
const inputStyle = 'grow my-1 py-2 px-3';

export default function WritePostForm({ username, id, postDetail }: Props) {
  const editorRef = useRef<Editor | null>(null);
  //tag- 배열로 관리하다가 form전송시 string으로 변환
  const initialState = {
    title: postDetail?.title || '',
    description: postDetail?.description || '',
    tags: postDetail?.tags || [],
  };

  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState(initialState);
  const { writePost } = useUserPost(username, 'all');

  const isMutating = isFetching || isPending;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTags = (tagArr: string[]) => {
    setForm((prev) => ({ ...prev, ['tags']: [...tagArr] }));
  };

  const handleAlert = (content: string) => {
    if (!form.title.trim()) {
      alert('제목을 입력해 주세요');
      return false;
    }
    if (!content.trim()) {
      alert('내용을 입력해주세요');
      return false;
    }
    return true;
  };

  const handleSubmit = (id?: string) => async () => {
    const content = editorRef.current?.getInstance().getMarkdown();
    if (handleAlert(content)) {
      setIsFetching(true);
      await writePost(content, form, id);
      setIsFetching(false);
      startTransition(() => {
        const url = id ? `/${username}/posts/${id}` : `/${username}`;
        router.push(url);
      });
    }
  };

  return (
    <section className='flex flex-col'>
      {isMutating && <PageLoader label='업로드중...' />}
      <div className='my-3 mx-auto max-w-screen-lg w-full px-4 '>
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
            className={`${inputStyle} input`}
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
            className={`${inputStyle} input`}
            autoComplete='off'
          />
        </div>
        <TagsInput tags={form.tags} handleTags={handleTags} />
      </div>
      <TuiEditors content={postDetail?.content || ' '} editorRef={editorRef} />
      <div className='m-3 mx-4 laptop:mx-8 desktop:mx-12 flex justify-end gap-3'>
        <Button onClick={() => router.back()} size='big'>
          뒤로가기
        </Button>
        <Button
          color='black'
          onClick={postDetail ? handleSubmit(id) : handleSubmit()}
          size='big'
        >
          출간하기
        </Button>
      </div>
    </section>
  );
}

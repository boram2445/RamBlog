'use client';

import { ChangeEvent, useRef, useState, useTransition } from 'react';
import TuiEditors from './TuiEditors';
import { Editor } from '@toast-ui/react-editor';
import { useRouter } from 'next/navigation';
import { PostData } from '@/service/posts';
import Button from '../ui/Button';
import { HashLoader } from 'react-spinners';
import TagsInput from './TagsInput';
import useUserPost from '@/hooks/useUserPost';

type Props = {
  username: string;
  id?: string;
  postDetail?: PostData;
};

const inputBoxStyle = 'flex gap-2 items-center';
const inputStyle =
  'grow my-1 py-2 px-3 border border-gray-200 bg-gray-50 rounded-md';

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

  const handleSubmit = async () => {
    const content = editorRef.current?.getInstance().getMarkdown();
    if (handleAlert(content)) {
      setIsFetching(true);
      await writePost(content, form);
      setIsFetching(false);
      startTransition(() => {
        router.push(`/${username}`);
      });
    }
  };

  const handleEdit = async () => {
    const content = editorRef.current?.getInstance().getMarkdown();
    if (!id) return;
    if (handleAlert(content)) {
      setIsFetching(true);
      await writePost(content, form, id);
      setIsFetching(false);
      startTransition(() => {
        router.push(`/${username}/posts/${id}`);
      });
    }
  };

  return (
    <section className='flex flex-col'>
      {isMutating && (
        <div className='fixed bg-gray-200 inset-0 z-20 bg-opacity-40 flex flex-col items-center justify-center gap-4'>
          <HashLoader />
          <p>업로드 중...</p>
        </div>
      )}
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
        <TagsInput tags={form.tags} handleTags={handleTags} />
      </div>

      <TuiEditors content={postDetail?.content || ' '} editorRef={editorRef} />
      <div className='m-3 mx-4 laptop:mx-8 desktop:mx-12 flex justify-end gap-3'>
        <Button onClick={() => router.back()} type='big'>
          뒤로가기
        </Button>
        <Button
          color='black'
          onClick={postDetail ? handleEdit : handleSubmit}
          type='big'
        >
          출간하기
        </Button>
      </div>
    </section>
  );
}

const getMainImageUrl = (content: string) => {
  const markdownRegex = /!\[.*?\]\((https?:\/\/\S+)\)/;
  const htmlImgRegex = /<img\s+[^>]*src="([^"]+)"[^>]*>/i;

  const markdownMatch = content.match(markdownRegex);
  const htmlMatch = content.match(htmlImgRegex);

  if (markdownMatch) {
    return markdownMatch[1];
  } else if (htmlMatch) {
    return htmlMatch[1];
  } else {
    return '';
  }
};

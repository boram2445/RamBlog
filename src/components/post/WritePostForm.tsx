'use client';

import { ChangeEvent, useState, useTransition } from 'react';
import dynamic from 'next/dynamic';

const MdEditor = dynamic(() => import('./MdEditor'), { ssr: false });

import { useRouter } from 'next/navigation';
import { PostDetail } from '@/model/post';
import Button from '../ui/Button';
import TagsInput from './TagsInput';
import PageLoader from '../ui/PageLoader';
import axios from 'axios';
import { getMainImageUrl } from '@/utils/mainImage';

type Props = {
  slug: string;
  id?: string;
  postDetail?: PostDetail;
};

const inputBoxStyle = 'flex gap-2 items-center';
const inputStyle = 'grow my-1 py-2 px-3';

export default function WritePostForm({ slug, id, postDetail }: Props) {
  const [content, setContent] = useState(postDetail?.content || '');
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

  const writePost = async () => {
    const imageUrl = getMainImageUrl(content);

    const formData = new FormData();
    imageUrl && formData.append('mainImageUrl', imageUrl);
    form.title.trim() && formData.append('title', form.title);
    form.description && formData.append('description', form.description);
    form.tags.length !== 0 && formData.append('tags', form.tags.join());
    content.trim() && formData.append('content', content);

    await axios.post(id ? `/api/posts/${id}` : '/api/posts', formData);
  };

  const handleSubmit = async () => {
    if (handleAlert(content)) {
      setIsFetching(true);
      await writePost();
      setIsFetching(false);
      startTransition(() => {
        // 목록은 서버 렌더링 — API가 revalidateTag로 Data Cache를 비우고,
        // refresh()가 클라이언트 라우터 캐시까지 비워야 새 글이 즉시 보인다
        router.refresh();
        router.push(id ? `/${slug}/posts/${id}` : `/${slug}`);
      });
    }
  };

  return (
    <section className="flex flex-col">
      {isMutating && <PageLoader label="업로드중..." />}
      <div className="my-3 mx-auto max-w-screen-lg w-full tablet:px-4 ">
        <div className={inputBoxStyle}>
          <label htmlFor="title">제목</label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="제목을 입력하세요"
            autoFocus
            value={form.title}
            onChange={handleChange}
            className={`${inputStyle} input`}
            autoComplete="off"
          />
        </div>
        <div className={inputBoxStyle}>
          <label htmlFor="description">설명</label>
          <input
            type="text"
            id="description"
            name="description"
            placeholder="한줄 설명을 입력해주세요"
            value={form.description}
            onChange={handleChange}
            className={`${inputStyle} input`}
            autoComplete="off"
          />
        </div>
        <TagsInput tags={form.tags} handleTags={handleTags} />
      </div>
      <MdEditor value={content} onChange={(value) => setContent(value ?? '')} />
      <div className="m-3 mx-4 laptop:mx-8 desktop:mx-12 flex justify-end gap-3">
        <Button onClick={() => router.back()} size="big">
          뒤로가기
        </Button>
        <Button color="black" onClick={handleSubmit} size="big">
          출간하기
        </Button>
      </div>
    </section>
  );
}

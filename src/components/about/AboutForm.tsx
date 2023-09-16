'use client';

import { Portfolio } from '@/service/portfolio';
import { ChangeEvent, FormEvent, useState, useTransition } from 'react';
import { sectionClass } from './AboutList';
import TagsInput from '../post/TagsInput';
import ArticleFormList from './ArticleFormList';
import AddButton from './AddButton';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Button from '../ui/Button';
import TextArea from '../ui/TextArea';
import PageLoader from '../ui/PageLoader';

type Props = {
  username: string;
  portfolio: Portfolio;
};

const titleClass =
  'text-2xl font-semibold text-gray-800 bg-indigo-200 inline-block px-2 bg-opacity-50 leading-5';

export default function AboutForm({ username, portfolio }: Props) {
  const initialState = {
    introduce: portfolio?.introduce ?? '',
    skills: portfolio?.skills ?? [],
    businessExperiences: portfolio?.businessExperiences ?? [],
    projects: portfolio?.projects ?? [],
    educations: portfolio?.educations ?? [],
  };

  const [form, setForm] = useState(initialState);
  const [isPending, startTransition] = useTransition();
  const [isFetching, setIsFetching] = useState(false);
  const router = useRouter();

  const isMutating = isFetching || isPending;

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkills = (tagArr: string[]) => {
    setForm((prev) => ({ ...prev, ['skills']: [...tagArr] }));
  };

  //재사용 함수
  const uploadImg = async (file: Blob | File) => {
    const formData = new FormData();
    formData.append('file', file);
    return axios.post('/api/image', formData).then((res) => res.data.document);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setIsFetching(true);

    const uploadTasks = [];
    for (const project of form.projects) {
      if (project.image instanceof File) {
        const uploadTask = uploadImg(project.image)
          .then((data) => data.url)
          .then((imageUrl) => (project.image = imageUrl))
          .catch((error) => console.error('이미지 업로드 오류:', error));

        uploadTasks.push(uploadTask);
      }
    }
    try {
      await Promise.all(uploadTasks);

      await axios.post(`/api/${username}/about`, {
        id: portfolio?.id,
        form,
      });

      setIsFetching(false);
      startTransition(() => {
        router.refresh();
        router.push(`/${username}/about`);
      });
    } catch (error) {
      console.error('데이터 전송 오류:', error);
    }
  };

  const handleChangeList = (
    target: ExperienceItem,
    value: string | boolean | File,
    type: ExperienceList,
    id: string
  ) => {
    const item = form[type].find((item) => item.id === id);
    const newItem = { ...item, [target]: value };
    const newList = form[type].map((item) => (item.id === id ? newItem : item));
    setForm((prev) => ({ ...prev, [type]: newList }));
  };

  const handleRemoveList = (id: string, type: ExperienceList) => {
    const newList = form[type].filter((item) => item.id !== id);
    setForm((prev) => ({ ...prev, [type]: newList }));
  };

  const addListItem = (type: ExperienceList) => {
    const item =
      type === 'projects'
        ? { ...projectState, id: Date.now() }
        : { ...experienceState, id: Date.now() };
    const newList = [item, ...form[type]];
    setForm((prev) => ({ ...prev, [type]: newList }));
  };

  return (
    <>
      {isMutating && <PageLoader label='수정중...' />}
      <form
        onSubmit={handleSubmit}
        className='mx-auto max-w-screen-lg px-2 tablet:px-5 laptop:px-8'
      >
        <section className={sectionClass}>
          <h3 className={`${titleClass} mb-5 mt-3`}>Introduce</h3>
          <div className='px-4'>
            <TextArea
              value={form.introduce}
              onChange={handleChange}
              name='introduce'
            />
          </div>
        </section>
        <section className={sectionClass}>
          <h3 className={`${titleClass} mb-5 mt-3`}>Skills</h3>
          <div className='px-4'>
            <TagsInput
              tags={form.skills}
              handleTags={handleSkills}
              type='col'
            />
          </div>
        </section>
        <section className={sectionClass}>
          <div className='flex gap-3 items-center mt-3 mb-5'>
            <h3 className={titleClass}>Worked at</h3>
            <AddButton onClick={() => addListItem('businessExperiences')} />
          </div>
          {form.businessExperiences && (
            <ArticleFormList
              list={form.businessExperiences}
              label='회사'
              type='businessExperiences'
              onRemove={(id) => handleRemoveList(id, 'businessExperiences')}
              onChange={(target, value, id) =>
                handleChangeList(target, value, 'businessExperiences', id)
              }
            />
          )}
        </section>
        <section className={sectionClass}>
          <div className='flex gap-3 items-center mt-3 mb-5'>
            <h3 className={titleClass}>Projects</h3>
            <AddButton onClick={() => addListItem('projects')} />
          </div>
          {form.projects && (
            <ArticleFormList
              list={form.projects}
              label='프로젝트'
              type='projects'
              onRemove={(id) => handleRemoveList(id, 'projects')}
              onChange={(target, value, id) =>
                handleChangeList(target, value, 'projects', id)
              }
            />
          )}
        </section>
        <section className={sectionClass}>
          <div className='flex gap-3 items-center mt-3 mb-5'>
            <h3 className={titleClass}>Educations</h3>
            <AddButton onClick={() => addListItem('educations')} />
          </div>
          {form.educations && (
            <ArticleFormList
              list={form.educations}
              label='교육'
              type='educations'
              onRemove={(id) => handleRemoveList(id, 'educations')}
              onChange={(target, value, id) =>
                handleChangeList(target, value, 'educations', id)
              }
            />
          )}
        </section>
        <div className='flex justify-end gap-2'>
          <Button onClick={() => router.back()}>취소</Button>
          <Button onClick={(e: FormEvent) => handleSubmit(e)} color='black'>
            저장
          </Button>
        </div>
      </form>
    </>
  );
}

const experienceState = {
  name: '',
  startDate: '',
  endDate: '',
  holding: false,
  content: '',
};

const projectState = {
  ...experienceState,
  image: null,
  link: '',
};

export type ExperienceList = 'businessExperiences' | 'projects' | 'educations';
export type ExperienceItem =
  | 'name'
  | 'startDate'
  | 'endDate'
  | 'holding'
  | 'content'
  | 'image'
  | 'link';

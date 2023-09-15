'use client';

import { Portfolio } from '@/service/portfolio';
import { ChangeEvent, FormEvent, useState } from 'react';
import { sectionClass, titleClass } from './AboutList';
import TagsInput from '../post/TagsInput';
import ArticleFormList from './ArticleFormList';
import AddButton from './AddButton';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Button from '../ui/Button';

type Props = {
  username: string;
  portfolio: Portfolio;
};

export default function AboutForm({ username, portfolio }: Props) {
  const initialState = {
    introduce: portfolio.introduce ?? '',
    skills: portfolio.skills ?? [],
    businessExperiences: portfolio.businessExperiences ?? [],
    projects: portfolio.projects ?? [],
    educations: portfolio.educations ?? [],
  };

  const [form, setForm] = useState(initialState);
  const router = useRouter();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkills = (tagArr: string[]) => {
    setForm((prev) => ({ ...prev, ['skills']: [...tagArr] }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    axios
      .post(`/api/${username}/about`, { id: portfolio?.id, form })
      .then(() => {
        router.push(`/${username}/about`);
      });
  };

  const handleChangeList = (
    target: ExperienceItem,
    value: string | boolean,
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
    <form
      onSubmit={handleSubmit}
      className='mx-auto max-w-screen-lg px-2 tablet:px-5 laptop:px-8'
    >
      <Button type='submit'>저장</Button>
      <section className={sectionClass}>
        <h3 className={titleClass}>Introduce</h3>
        <textarea
          className='w-full px-4 border border-slate-200 rounded-lg text-gray-700'
          value={form.introduce}
          name='introduce'
          onChange={handleChange}
        />
      </section>
      <section className={sectionClass}>
        <h3 className={titleClass}>Skills</h3>
        <div className='px-4'>
          <TagsInput tags={form.skills} handleTags={handleSkills} />
        </div>
      </section>
      <section className={sectionClass}>
        <div className='flex gap-3 items-center mt-3 mb-5'>
          <h3 className={`${titleClass} mt-0 mb-0`}>Worked at</h3>
          <AddButton onClick={() => addListItem('businessExperiences')} />
        </div>
        {form.businessExperiences && (
          <ArticleFormList
            list={form.businessExperiences}
            label='회사'
            onRemove={(id) => handleRemoveList(id, 'businessExperiences')}
            onChange={(target, value, id) =>
              handleChangeList(target, value, 'businessExperiences', id)
            }
          />
        )}
      </section>
      <section className={sectionClass}>
        <div className='flex gap-3 items-center mt-3 mb-5'>
          <h3 className={`${titleClass} mt-0 mb-0`}>Projects</h3>
          <AddButton onClick={() => addListItem('projects')} />
        </div>
        {form.projects && (
          <ArticleFormList
            list={form.projects}
            label='프로젝트'
            onRemove={(id) => handleRemoveList(id, 'projects')}
            onChange={(target, value, id) =>
              handleChangeList(target, value, 'projects', id)
            }
          />
        )}
      </section>
      <section className={sectionClass}>
        <div className='flex gap-3 items-center mt-3 mb-5'>
          <h3 className={`${titleClass} mt-0 mb-0`}>Educations</h3>
          <AddButton onClick={() => addListItem('educations')} />
        </div>
        {form.educations && (
          <ArticleFormList
            list={form.educations}
            label='교육'
            onRemove={(id) => handleRemoveList(id, 'educations')}
            onChange={(target, value, id) =>
              handleChangeList(target, value, 'educations', id)
            }
          />
        )}
      </section>
    </form>
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
  | 'content';

'use client';

import { HomeUser, Links } from '@/model/user';
import Button from '../ui/Button';
import Avartar from '../ui/Avartar';
import { ChangeEvent, FormEvent, useState, useTransition } from 'react';
import { AiOutlineCamera } from 'react-icons/ai';
import SocialForm, { SocialType } from './SocialForm';
import SocialLinks from './SocialLinks';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import PageLoader from '../ui/PageLoader';
import { mutate } from 'swr';

type Props = {
  userData: HomeUser;
};

export default function ProfileForm({ userData }: Props) {
  const router = useRouter();

  const [image, setImage] = useState<string | File | null>(
    userData?.image ?? null
  );
  const [title, setTitle] = useState(userData?.title ?? '');
  const [introduce, setIntroduce] = useState(userData?.introduce ?? '');
  const [name, setName] = useState(userData?.name ?? '');
  const [isOpenSocial, setIsOpenSocial] = useState(false);
  const [error, setError] = useState('');

  const [linkForm, setlinkForm] = useState<Links>({
    github: userData.links.github ?? '',
    email: userData.links.email ?? '',
    twitter: userData.links.twitter ?? '',
    facebook: userData.links.facebook ?? '',
    youtube: userData.links.youtube ?? '',
    homePage: userData.links.homePage ?? '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = e.target?.files;

    if (files && files[0]) {
      setImage(files[0]); //파일 저장
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'title') setTitle(value);
    else if (name === 'introeuce') setIntroduce(value);
    else if (name === 'name') setName(value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('블로그 타이틀을 설정해 주세요.');
      return;
    }
    if (!name.trim()) {
      alert('닉네임을 설정해 주세요');
      return;
    }

    const formData = new FormData();

    setIsLoading(true);

    image && typeof image !== 'string' && formData.append('image', image);
    formData.append('title', title);
    formData.append('introduce', introduce);
    formData.append('name', name);
    Object.entries(linkForm).forEach(([key, value]) =>
      formData.append(key, value)
    );

    axios
      .post(`/api/${userData.username}/me/setting`, formData)
      .then(() => {
        router.refresh();
        mutate(`/api/${userData.username}/me`);
        router.push(`/${userData.username}`);
      })
      .catch((err) => setError(err.toString()))
      .finally(() => setIsLoading(false));
  };

  return (
    <section>
      {isLoading && <PageLoader label='수정중...' />}
      <form onSubmit={handleSubmit}>
        <div className='flex gap-10'>
          <div>
            <div className='relative'>
              <div className='p-3 border border-gray-100 rounded-full'>
                <Avartar
                  imageUrl={
                    !image
                      ? ''
                      : typeof image === 'string'
                      ? image
                      : URL.createObjectURL(image)
                  }
                  username={userData.username}
                  type='max'
                />
              </div>
              <input
                className='hidden'
                name='input'
                id='input-upload'
                type='file'
                accept='image/*'
                onChange={handleChangeImage}
              />
              <label
                htmlFor='input-upload'
                className='absolute bottom-0 right-0 flex items-center justify-center w-12 h-12 bg-white border border-gray-200 padding-4 rounded-full'
              >
                <AiOutlineCamera className='w-6 h-6 text-gray-300' />
              </label>
            </div>
          </div>
          <div className='grow mt-5 flex flex-col'>
            <label className='text-xs mb-2'>
              블로그 타이틀
              <span className='text-pink-500 font-semibold'>*</span>
            </label>
            <input
              type='text'
              name='title'
              className='text-2xl font-semibold text-gray-900 border-b border-gray-200 outline-none placeholder:text-lg placeholder:font-medium '
              defaultValue={title}
              onChange={handleChange}
              placeholder='한문장으로 나를 어필해 보세요.'
            />
            <label className='text-xs mb-2 mt-4'>
              소개 <span className='text-pink-500 font-semibold'>*</span>
            </label>
            <textarea
              name='introduce'
              className='h-28 p-2 grow text-gray-700 border border-gray-200 outline-none '
              defaultValue={introduce}
              onChange={handleChange}
              placeholder='간단한 소개를 입력해주세요.'
            />
          </div>
        </div>
        <div className='my-8 flex flex-col'>
          <div className='flex items-center'>
            <label className='text-lg font-semibold' htmlFor='name'>
              닉네임 <span className='text-pink-500'>*</span>
            </label>
            <small className='ml-5 text-xs text-gray-400'>
              1에서 10자까지 입력 가능합니다.
            </small>
          </div>
          <input
            id='name'
            name='name'
            type='text'
            value={name}
            onChange={handleChange}
            className='p-2 border-b border-gray-200 outline-none text-sm'
            autoComplete='off'
          />
        </div>
        <section>
          <div className='my-4'>
            <div className='flex justify-between'>
              <div>
                <h4 className='text-lg font-semibold'>소셜 정보</h4>
                <small className='text-xs text-gray-400'>
                  포스트 및 블로그에서 보여지는 프로필에 사용되는 소셜
                  정보입니다.
                </small>
              </div>
              <button
                className='hover:underline'
                onClick={() => setIsOpenSocial((prev) => !prev)}
                type='button'
              >
                {isOpenSocial ? '취소' : '수정'}
              </button>
            </div>
          </div>
          {!isOpenSocial ? (
            <SocialLinks links={userData.links} />
          ) : (
            <SocialForm links={linkForm} onChange={setlinkForm} />
          )}
        </section>

        <div className='mt-8 flex gap-3 justify-center'>
          <Button onClick={() => setIsOpenSocial(false)}>취소하기</Button>
          <Button color='black' type='submit'>
            저장하기
          </Button>
        </div>
      </form>
    </section>
  );
}

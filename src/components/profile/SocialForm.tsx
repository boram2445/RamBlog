'use client';

import { BsGithub, BsTwitter, BsFacebook, BsYoutube } from 'react-icons/bs';
import { MdEmail } from 'react-icons/md';
import { AiOutlineHome } from 'react-icons/ai';
import { ChangeEvent, useState } from 'react';
import { Links } from '@/model/user';

type Props = {
  links: Links;
};

const iconStyle = 'w-5 h-5 text-gray-500';

export default function SocialForm({ links }: Props) {
  const [form, setForm] = useState({
    github: links.github ?? '',
    email: links.email ?? '',
    twitter: links.twitter ?? '',
    facebook: links.facebook ?? '',
    youtube: links.youtube ?? '',
    homePage: links.homePage ?? '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>, name: NameType) => {
    setForm((prev) => ({ ...prev, [name]: e.target.value }));
  };

  return (
    <section>
      <div className='my-4'>
        <h4 className='text-lg font-semibold'>소셜 정보</h4>
        <small className='text-xs text-gray-400'>
          포스트 및 블로그에서 보여지는 프로필에 사용되는 소셜 정보입니다.
        </small>
      </div>
      <ul>
        {list.map((item, index) => (
          <li key={index} className='flex gap-3 items-center'>
            {item.icon}
            <input
              type='text'
              value={form[item.name as NameType]}
              onChange={(e) => handleChange(e, item.name as NameType)}
              className='mb-2 p-2 grow border border-gray-200 rounded-md outline-blue-500 text-sm'
              placeholder={item.placeholder}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

type NameType =
  | 'github'
  | 'email'
  | 'twitter'
  | 'facebook'
  | 'youtube'
  | 'homePage';

const list = [
  {
    name: 'github',
    icon: <BsGithub className={iconStyle} />,
    placeholder: 'Github 링크를 입력하세요',
  },
  {
    name: 'email',
    icon: <MdEmail className={iconStyle} />,
    placeholder: '이메일을 입력하세요',
  },
  {
    name: 'twitter',
    icon: <BsTwitter className={iconStyle} />,
    placeholder: 'Twitter 주소를 입력하세요',
  },
  {
    name: 'facebook',
    icon: <BsFacebook className={iconStyle} />,
    placeholder: 'Facebook 주소를 입력하세요',
  },
  {
    name: 'youtube',
    icon: <BsYoutube className={iconStyle} />,
    placeholder: 'Youtube 주소를 입력하세요',
  },
  {
    name: 'homePage',
    icon: <AiOutlineHome className={iconStyle} />,
    placeholder: '홈페이지 주소를 입력하세요',
  },
];

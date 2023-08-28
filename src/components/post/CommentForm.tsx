'use client';

import { useSession } from 'next-auth/react';
import Button from '../ui/Button';

const inputStyle = 'p-2 border border-gray-300 rounded-lg placeholder:text-sm';

export default function CommentForm() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div className='w-full px-4 tablet:px-8 laptop:px-16 desktop:px-20'>
      <h4 className='border-b border-gray-200 pb-1 mb-5 text-sm text-gray-500 font-semibold'>
        댓글 <span className='text-red-500'>0</span>
      </h4>
      <textarea
        placeholder='여러분의 소중한 댓글을 입력해주세요'
        className={`w-full h-28 ${inputStyle}`}
      />
      <div className={`flex ${user ? 'justify-end' : 'justify-between'}`}>
        {!user && (
          <div className='flex gap-2'>
            <input type='text' placeholder='이름' className={inputStyle} />
            <input
              type='text'
              placeholder='댓글 비밀번호'
              className={inputStyle}
            />
            <Button>간편 로그인</Button>
          </div>
        )}
        <Button color='black'>등록</Button>
      </div>
    </div>
  );
}

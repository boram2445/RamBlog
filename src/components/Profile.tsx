import Image from 'next/image';
import Link from 'next/link';
import ProfileImg from '../../public/images/profile.jpg';

export default function Profile() {
  return (
    <section className='text-center py-5 bg-light-brown'>
      <Image
        src={ProfileImg}
        alt='프로파일 이미지'
        width={200}
        height={200}
        className='rounded-full mx-auto'
      />
      <h3 className='my-2 text-xl font-semibold'>Hi, I&apos;m Boram</h3>
      <p>
        안녕하세요😚 프론트엔드 개발자를
        <br />
        꿈꾸고 있는 김보람입니다.
      </p>
      {/* 버튼을 Link로 감싸야 할까 */}
      <button className='my-2.5 py-1.5 px-6 border-stone-300 border-2 rounded-xl text-sm ease-in hover:brightness-125 '>
        <Link href='/contact'>Contact Me</Link>
      </button>
    </section>
  );
}

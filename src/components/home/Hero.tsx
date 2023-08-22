import Image from 'next/image';
import Link from 'next/link';
import ProfileImg from '../../../public/images/profile.jpg';

export default function Hero() {
  return (
    <section className='text-center py-5'>
      <Image
        src={ProfileImg}
        alt='프로파일 이미지'
        className='rounded-full w-44 h-40 mx-auto'
      />
      <h2 className='my-2 text-xl font-semibold'>{`Hi, I'm Boram`}</h2>
      <p className='mb-3'>
        안녕하세요😚 프론트엔드 개발자를
        <br />
        꿈꾸고 있는 김보람입니다.
      </p>
      <Link
        href='/contact'
        className='py-1.5 px-6 border-stone-300 border-2 rounded-xl text-sm hover:brightness-125'
      >
        Contact Me
      </Link>
    </section>
  );
}

import ContactForm from '@/components/contact/ContactForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Me',
  description: 'Boram에게 메일 보내기',
};

export default function ContactPage() {
  return (
    <div className='max-w-screen-lg mx-auto p-2 tablet:p-5 laptop:p-8'>
      <div className='rounded-xl py-3 px-8 shadow-md'>
        <h2 className='text-lg font-semibold text-black mb-1'>
          Please Contact Me
        </h2>
        <p className='text-dark-gray text-sm'>
          메일, 카카오톡, 깃허브를 통해 연락주세요 🙌 <br /> 혹은 아래 메일
          보내기를 통해 간편하게 메일을 보낼 수 있습니다
        </p>
      </div>
      <section>
        <h2 className='text-black mt-12 mb-8 text-2xl text-center font-semibold'>
          Contact me with mail
        </h2>
        <ContactForm />
      </section>
    </div>
  );
}

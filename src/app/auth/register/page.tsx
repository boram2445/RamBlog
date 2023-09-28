import Register from '@/components/register/Register';

export default function RegisterPage() {
  return (
    <section className='mx-auto max-w-2xl my-10 relative flex justify-center flex-col'>
      <h1 className='mb-7 text-gray-800 text-3xl font-semibold py-4'>
        Sign up to RamBlog
      </h1>
      <Register />
    </section>
  );
}

import Image from 'next/image';

type Props = {
  title: string;
  description: string;
  date: string;
  image: string;
};

export default function ExperienceArticle({
  experience,
}: {
  experience: Props;
}) {
  const { title, description, date, image } = experience;

  return (
    <div className='mb-10 flex gap-10 items-center '>
      <div className='relative w-20 h-20'>
        <Image
          src={image}
          alt={`${title} 이미지`}
          fill
          className='rounded-lg'
        />
      </div>
      <div>
        <h4 className='mb-1 text-xl font-semibold text-black'>{title}</h4>
        <p>{description}</p>
        <p className='text-sm mt-3'>{date}</p>
      </div>
    </div>
  );
}

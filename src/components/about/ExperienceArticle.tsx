import { Experience } from '@/service/portfolio';
import DuringDate from './DuringDate';

type Props = {
  experience: Experience;
  label?: string;
};

export default function ExperienceArticle({ experience, label }: Props) {
  const { name, startDate, endDate, holding, content } = experience;

  return (
    <>
      <div className='flex gap-5 mb-1'>
        <h4 className='text-lg font-semibold text-gray-800'>{name}</h4>
        <DuringDate
          startDate={startDate}
          endDate={endDate}
          holding={holding}
          label={label}
        />
      </div>
      <p className='whitespace-pre-line break-all text-gray-700'>{content}</p>
    </>
  );
}

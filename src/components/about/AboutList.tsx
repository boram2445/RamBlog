import { Portfolio } from '@/service/portfolio';
import TagList from '../common/TagList';
import ProjectArticle from './ProjectArticle';
import PostGrid from '../common/PostGrid';

type Props = {
  portfolio: Portfolio;
};

export default function AboutList({ portfolio }: Props) {
  const { skills, introduce, businessExperiences, projects, educations } =
    portfolio;

  return (
    <>
      <section className='mb-10 pb-10 border-b border-light-gray'>
        <h3 className='my-3 text-2xl font-semibold text-black'>Introduce</h3>
        <p className='text-gray-700 whitespace-pre'>{portfolio.introduce}</p>
      </section>
      <section className='mb-10 pb-10 border-b border-light-gray'>
        <h3 className='my-3 text-2xl font-semibold text-black'>Skills</h3>
        <TagList tags={portfolio.skills} type='big' />
      </section>
      <section className='mb-10 pb-10 border-b border-light-gray'>
        <h3 className='my-3 text-2xl font-semibold text-black'>Projects</h3>
        <ul className='mx-auto grid grid-cols-1 tablet:grid-cols-2  laptop:grid-cols-3 gap-6'>
          {portfolio.projects?.map((project, index) => (
            <ProjectArticle project={project} key={index} />
          ))}
        </ul>
      </section>
      <section className='mb-12'>
        <h3 className='my-8 text-2xl font-semibold text-black'>Education</h3>
        <div className='p-5'>
          {portfolio.educations?.map((education, index) => (
            <>
              <p key={index}>{education.name}</p>
              <p className='whitespace-pre'>{education.content}</p>
            </>
          ))}
        </div>
      </section>
    </>
  );
}

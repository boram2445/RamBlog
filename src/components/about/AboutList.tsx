import { Portfolio } from '@/service/portfolio';
import TagList from '../common/TagList';
import ProjectArticle from './ProjectArticle';
import ExperienceArticle from './ExperienceArticle';

type Props = {
  portfolio: Portfolio;
};

export const sectionClass = 'mb-8 pb-8 border-b border-gray-200';
export const titleClass =
  'mt-3 mb-5 text-2xl font-semibold text-gray-800 bg-indigo-200 inline-block px-2 bg-opacity-50 leading-5';

export default function AboutList({ portfolio }: Props) {
  if (!portfolio)
    return (
      <p className='text-gray-700 text-center'>아직 등록된 소개가 없어요😥</p>
    );

  const { skills, introduce, businessExperiences, projects, educations } =
    portfolio;
  return (
    <div className='mx-auto max-w-screen-lg px-2 tablet:px-5 laptop:px-8'>
      {introduce && (
        <section className={sectionClass}>
          <h3 className={titleClass}>Introduce</h3>
          <p className='px-4 text-gray-700 whitespace-pre'>
            {portfolio.introduce}
          </p>
        </section>
      )}
      {skills && (
        <section className={sectionClass}>
          <h3 className={titleClass}>Skills</h3>
          <div className='px-4'>
            <TagList tags={portfolio.skills} type='big' />
          </div>
        </section>
      )}
      {businessExperiences && (
        <section className={sectionClass}>
          <h3 className={titleClass}>Worked at</h3>
          <ul className='px-4'>
            {portfolio.businessExperiences?.map((experience, index) => (
              <li key={index}>
                <ExperienceArticle experience={experience} label='재직중' />
              </li>
            ))}
          </ul>
        </section>
      )}
      {projects && (
        <section className={sectionClass}>
          <h3 className={titleClass}>Projects</h3>
          <ul className='px-4 mx-auto grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 gap-6'>
            {portfolio.projects?.map((project, index) => (
              <ProjectArticle project={project} key={index} />
            ))}
          </ul>
        </section>
      )}
      {educations && (
        <section className={sectionClass}>
          <h3 className={titleClass}>Education</h3>
          <ul className='px-4 flex flex-col gap-6'>
            {portfolio.educations?.map((education, index) => (
              <li key={index}>
                <ExperienceArticle experience={education} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

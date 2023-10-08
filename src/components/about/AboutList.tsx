import { Portfolio } from '@/model/portfolio';
import TagList from '../common/TagList';
import ProjectArticle from './ProjectArticle';
import ExperienceArticle from './ExperienceArticle';
import NoContent from '../ui/NoContent';

type Props = {
  portfolio: Portfolio;
};

export const sectionClass =
  'mb-8 pb-8 border-b border-gray-200 dark:border-neutral-700';
export const titleClass = 'mt-3 mb-5 color-title';
const noContent = <NoContent text='아직 등록된 소개가 없어요😥' />;

export default function AboutList({ portfolio }: Props) {
  if (!portfolio) return noContent;
  const { skills, introduce, businessExperiences, projects, educations } =
    portfolio;

  if (
    !introduce &&
    skills.length === 0 &&
    businessExperiences.length === 0 &&
    projects.length === 0 &&
    educations.length === 0
  )
    return noContent;

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
      {skills.length > 0 && (
        <section className={sectionClass}>
          <h3 className={titleClass}>Skills</h3>
          <div className='px-4'>
            <TagList tags={portfolio.skills} type='big' />
          </div>
        </section>
      )}
      {businessExperiences.length > 0 && (
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
      {projects.length > 0 && (
        <section className={sectionClass}>
          <h3 className={titleClass}>Projects</h3>
          <ul className='px-4 mx-auto grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 gap-6'>
            {portfolio.projects?.map((project, index) => (
              <ProjectArticle project={project} key={index} />
            ))}
          </ul>
        </section>
      )}
      {educations.length > 0 && (
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

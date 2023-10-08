import { Experience, Project } from '@/model/portfolio';
import ArticleForm from './ArticleForm';
import { ExperienceItem, ExperienceList } from './AboutForm';

type Props = {
  list: Experience[] | Project[];
  label: string;
  type: ExperienceList;
  onRemove: (id: string) => void;
  onChange: (
    target: ExperienceItem,
    value: string | boolean | File,
    id: string
  ) => void;
};

export default function ArticleFormList({
  list,
  label,
  type,
  onRemove,
  onChange,
}: Props) {
  return (
    <ul>
      {list.map((experience) => (
        <li key={experience.id} className='mb-2 mx-4'>
          <ArticleForm
            experience={experience}
            label={label}
            type={type}
            onRemove={onRemove}
            onChange={onChange}
          />
        </li>
      ))}
    </ul>
  );
}

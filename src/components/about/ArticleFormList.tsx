import { Experience, Project } from '@/service/portfolio';
import ArticleForm from './ArticleForm';
import { ExperienceItem } from './AboutForm';

type Props = {
  list: Experience[] | Project[];
  label: string;
  onRemove: (id: string) => void;
  onChange: (
    target: ExperienceItem,
    value: string | boolean,
    id: string
  ) => void;
};

export default function ArticleFormList({
  list,
  label,
  onRemove,
  onChange,
}: Props) {
  return (
    <ul>
      {list.map((experience) => (
        <li key={experience.id} className='mb-2'>
          <ArticleForm
            experience={experience}
            label={label}
            onRemove={onRemove}
            onChange={onChange}
          />
        </li>
      ))}
    </ul>
  );
}

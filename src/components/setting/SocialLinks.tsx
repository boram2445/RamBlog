import { Links } from '@/model/user';
import { getIcon } from '../user/LinkButtons';

type Props = {
  links: Links;
};

export default function SocialLinks({ links }: Props) {
  return (
    <ul className='flex flex-col gap-3'>
      {Object.entries(links).map(([key, value]) => {
        if (!value) return;
        return (
          <li
            key={key}
            className='flex items-center gap-3 text-gray-600 dark:text-slate-400'
          >
            {getIcon(key)}
            <p>{value}</p>
          </li>
        );
      })}
    </ul>
  );
}

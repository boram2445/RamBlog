import { Links } from '@/model/user';
import { BsGithub, BsTwitter, BsFacebook, BsYoutube } from 'react-icons/bs';
import { MdEmail } from 'react-icons/md';
import { AiOutlineHome } from 'react-icons/ai';

type Props = {
  links: Links;
};

const linkButtonStyle = 'text-gray-500 hover:text-gray-900 w-6 h-6';

export default function LinkButtons({ links }: Props) {
  return (
    <ul className='flex gap-2'>
      {Object.entries(links).map(([key, value]) => {
        if (!value) return;
        if (key === 'email') return getIcon(key);
        return (
          <a href={value} key={key} target='_blank'>
            {getIcon(key)}
          </a>
        );
      })}
    </ul>
  );
}

export function getIcon(linkType: string) {
  switch (linkType) {
    case 'github':
      return <BsGithub className={linkButtonStyle} />;
    case 'email':
      return <MdEmail className={`${linkButtonStyle} cursor-default`} />;
    case 'twitter':
      return <BsTwitter className={linkButtonStyle} />;
    case 'facebook':
      return <BsFacebook className={linkButtonStyle} />;
    case 'youtube':
      return <BsYoutube className={linkButtonStyle} />;
    case 'homePage':
      return <AiOutlineHome className={linkButtonStyle} />;
  }
}

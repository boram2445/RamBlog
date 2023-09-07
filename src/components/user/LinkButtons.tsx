import { BsGithub, BsTwitter, BsFacebook, BsYoutube } from 'react-icons/bs';
import { MdEmail } from 'react-icons/md';

type Props = {
  links: { linkType: string; urlOrEmail: string }[];
};

const linkButtonStyle = 'text-gray-500 hover:text-gray-900 w-6 h-6';

export default function LinkButtons({ links }: Props) {
  return (
    <ul className='flex gap-2'>
      {links.map(({ linkType, urlOrEmail }, index) => {
        return (
          <a
            href={linkType === 'email' ? '#' : urlOrEmail}
            key={index}
            target='_blank'
          >
            {getIcon(linkType)}
          </a>
        );
      })}
    </ul>
  );
}

function getIcon(linkType: string) {
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
  }
}

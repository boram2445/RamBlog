'use client';

import {
  BsLink45Deg,
  BsHeart,
  BsHeartFill,
  BsFillBookmarkFill,
  BsBookmark,
} from 'react-icons/bs';
import ToggleButton from '../ui/ToggleButton';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { PostDetail } from '@/model/post';
import axios from 'axios';

const buttonStyle = 'p-1 rounded-lg hover:bg-gray-200 flex items-center';
const iconStyle = 'w-5 h-5 text-gray-700';

type Props = {
  post: PostDetail;
};

export default function PostIcons({ post }: Props) {
  const { data: session } = useSession();
  const user = session?.user;

  const [onLike, setOnLike] = useState(
    user ? post.likes?.includes(user.username) : false
  );
  const [onBookMark, setOnBookMark] = useState(false);

  const handleLike = (like: boolean) => {
    axios
      .put(`/api/likes/`, { id: post.id, like: onLike })
      .then(() => setOnLike(like));
  };

  return (
    <div className='py-2 px-3 bg-gray-100 flex justify-between items-center'>
      <button className={buttonStyle}>
        <BsLink45Deg className='w-6 h-6 text-gray-600' />
      </button>
      <div className='flex gap-2 items-center'>
        <ToggleButton
          toggled={onLike}
          onToggle={handleLike}
          onIcon={<BsHeartFill className={iconStyle} />}
          offIcon={<BsHeart className={iconStyle} />}
          className={buttonStyle}
        />
        <ToggleButton
          toggled={onBookMark}
          onToggle={setOnBookMark}
          onIcon={<BsFillBookmarkFill className={iconStyle} />}
          offIcon={<BsBookmark className={iconStyle} />}
          className={buttonStyle}
        />
      </div>
    </div>
  );
}

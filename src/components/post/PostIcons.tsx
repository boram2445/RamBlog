'use client';

import {
  BsLink45Deg,
  BsHeart,
  BsHeartFill,
  BsFillBookmarkFill,
  BsBookmark,
} from 'react-icons/bs';
import ToggleButton from '../ui/ToggleButton';
import { PostDetail } from '@/model/post';
import axios from 'axios';
import useMe from '@/hooks/useMe';
import { useRouter } from 'next/navigation';

const buttonStyle =
  'p-1 rounded-lg hover:bg-gray-200 flex items-center dark:hover:bg-neutral-800';
const iconStyle = 'w-5 h-5 dark:text-slate-400';

type Props = {
  post: PostDetail;
};

export default function PostIcons({ post }: Props) {
  const { loggedInUser, setBookmark } = useMe();
  const router = useRouter();

  const liked = loggedInUser
    ? post.likes?.includes(loggedInUser?.username)
    : false;
  const bookmarked = loggedInUser?.bookmarks.includes(post.id) ?? false;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(window && window.location.href)
        .then(() => alert('링크가 복사되었습니다🔗'))
        .catch(() => alert('다시 시도해주세요😅'));
    }
  };

  const handleLike = (like: boolean) => {
    if (!loggedInUser) {
      router.push('/auth/signin');
      return;
    }

    axios
      .put(`/api/likes/`, { id: post.id, like })
      .then(() => router.refresh());
  };

  const handleBookmark = (bookmark: boolean) => {
    if (!loggedInUser) {
      router.push('/auth/signin');
      return;
    }

    setBookmark(post.id, bookmark).then(() => router.refresh());
  };

  return (
    <div className='py-2 px-3 bg-gray-100 flex justify-between items-center dark:bg-neutral-700'>
      <button className={buttonStyle} onClick={handleCopyLink}>
        <BsLink45Deg className='w-6 h-6 text-gray-600 dark:text-slate-400' />
      </button>
      <div className='flex gap-2 items-center'>
        <p className='text-gray-600 dark:text-slate-400'>
          {post.likes?.length}
        </p>
        <ToggleButton
          toggled={liked}
          onToggle={handleLike}
          onIcon={
            <BsHeartFill className={`${iconStyle} -mb-0.5 text-red-500`} />
          }
          offIcon={<BsHeart className={`${iconStyle} -mb-0.5 text-gray-500`} />}
          className={buttonStyle}
        />
        <ToggleButton
          toggled={bookmarked}
          onToggle={handleBookmark}
          onIcon={
            <BsFillBookmarkFill className={`${iconStyle} text-gray-500`} />
          }
          offIcon={<BsBookmark className={`${iconStyle} text-gray-500`} />}
          className={buttonStyle}
        />
      </div>
    </div>
  );
}

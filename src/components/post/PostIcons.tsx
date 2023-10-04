'use client';

import { useRouter } from 'next/navigation';
import axios from 'axios';
import useMe from '@/hooks/useMe';
import ToggleButton from '../ui/ToggleButton';
import {
  BsLink45Deg,
  BsHeart,
  BsHeartFill,
  BsFillBookmarkFill,
  BsBookmark,
} from 'react-icons/bs';
import useSWR from 'swr';

type Props = {
  postId: string;
};

const buttonStyle =
  'p-1 rounded-lg hover:bg-gray-200 flex items-center dark:hover:bg-neutral-800';
const iconStyle = 'w-5 h-5 dark:text-slate-400';

export default function PostIcons({ postId }: Props) {
  const { loggedInUser, setBookmark } = useMe();

  const { data: likes, mutate: likeMutate } = useSWR<string[]>(
    `/api/posts/${postId}/like`
  );
  const router = useRouter();

  const liked = likes ? likes?.includes(loggedInUser?.username ?? '') : false;
  const bookmarked = loggedInUser?.bookmarks.includes(postId) ?? false;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(window && window.location.href)
        .then(() => alert('링크가 복사되었습니다🔗'))
        .catch(() => alert('다시 시도해주세요😅'));
    }
  };

  const setLike = (postId: string, like: boolean) =>
    axios.put(`/api/likes`, { id: postId, like });

  const handleLike = (like: boolean) => {
    if (!loggedInUser) {
      router.push('/auth/signin');
      return;
    }
    if (!likes) return;

    const newLikesArr = like
      ? [...likes, loggedInUser.username]
      : likes.filter((user) => user !== loggedInUser.username);

    likeMutate(setLike(postId, like), {
      optimisticData: newLikesArr,
      populateCache: false,
      revalidate: false,
      rollbackOnError: true,
    });
  };

  const handleBookmark = (bookmark: boolean) => {
    if (!loggedInUser) {
      router.push('/auth/signin');
      return;
    }

    setBookmark(postId, bookmark);
  };

  return (
    <div className='py-2 px-3 bg-gray-100 flex justify-between items-center dark:bg-neutral-700'>
      <button
        className={buttonStyle}
        onClick={handleCopyLink}
        title='링크 복사'
      >
        <BsLink45Deg className='w-6 h-6 text-gray-600 dark:text-slate-400' />
      </button>
      <div className='flex gap-2 items-center'>
        <p className='text-gray-600 dark:text-slate-400'>
          {likes?.length ?? 0}
        </p>
        <ToggleButton
          toggled={liked}
          onToggle={handleLike}
          onIcon={
            <BsHeartFill className={`${iconStyle} -mb-0.5 text-red-500`} />
          }
          offIcon={<BsHeart className={`${iconStyle} -mb-0.5 text-gray-500`} />}
          className={buttonStyle}
          title='좋아요'
        />
        <ToggleButton
          toggled={bookmarked}
          onToggle={handleBookmark}
          onIcon={
            <BsFillBookmarkFill className={`${iconStyle} text-gray-500`} />
          }
          offIcon={<BsBookmark className={`${iconStyle} text-gray-500`} />}
          className={buttonStyle}
          title='북마크'
        />
      </div>
    </div>
  );
}

import {
  BsLink45Deg,
  BsHeart,
  BsHeartFill,
  BsFillBookmarkFill,
  BsBookmark,
} from 'react-icons/bs';

const buttonStyle = 'p-1 rounded-lg hover:bg-gray-200 flex items-center';

export default function PostIcons() {
  return (
    <div className='py-2 px-3 bg-gray-100 flex justify-between items-center'>
      <button className={buttonStyle}>
        <BsLink45Deg className='w-6 h-6 text-gray-600' />
      </button>
      <div className='flex gap-2 items-center'>
        <button className={buttonStyle}>
          <BsHeart className='w-5 h-5 text-gray-600' />
        </button>
        <button className={buttonStyle}>
          <BsBookmark className='w-5 h-5 text-gray-600' />
        </button>
      </div>
    </div>
  );
}

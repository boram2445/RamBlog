import { ChangeEvent, useState } from 'react';

type Props = {
  tags: string[];
  handleTags: (tagArr: string[]) => void;
};

export default function TagsInput({ tags, handleTags }: Props) {
  const [tag, setTag] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setTag(e.target.value);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const newTags = [...tags, tag];
      handleTags(newTags);
      setTag('');
    }
  };

  const handleTagClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const tag = e.currentTarget.textContent;
    const newTags = tags.filter((item) => item !== tag);
    handleTags(newTags);
  };

  return (
    <div className='flex gap-2 items-center'>
      <label htmlFor='tags' className='hidden'>
        태그
      </label>
      <ul className='flex gap-2'>
        {tags?.map((tag, index) => (
          <li key={index}>
            <button
              onClick={handleTagClick}
              className='px-3 border border-gray-300 rounded-full  hover:bg-gray-300'
            >
              {tag}
            </button>
          </li>
        ))}
      </ul>
      <input
        type='text'
        id='tags'
        name='tags'
        placeholder='태그를 입력해주세요'
        value={tag}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className='grow my-1 py-2 px-3 border border-gray-200 bg-gray-50 rounded-md outline-indigo-500'
        autoComplete='off'
      />
    </div>
  );
}

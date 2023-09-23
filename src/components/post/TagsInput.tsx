import { ChangeEvent, useState } from 'react';

type Props = {
  tags: string[];
  handleTags: (tagArr: string[]) => void;
  type?: 'row' | 'col';
};

export default function TagsInput({ tags, handleTags, type = 'row' }: Props) {
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
    <div
      className={`flex gap-2 ${
        type === 'col' ? 'flex-col' : 'flex-row items-center'
      }`}
    >
      <label htmlFor='tags' className='hidden'>
        태그
      </label>
      <ul className='flex gap-x-2 gap-y-4 flex-wrap'>
        {tags?.map((tag, index) => (
          <li key={index}>
            <button
              onClick={handleTagClick}
              className='px-3 border border-gray-300 rounded-full hover:bg-gray-300 dark:text-slate-300 dark:bg-neutral-700 dark:border-neutral-700 dark:hover:bg-neutral-600 dark:hover:text-slate-200'
              type='button'
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
        placeholder='입력 후 엔터를 누르면 태그가 생성되고, 태그를 클릭하면 삭제됩니다'
        value={tag}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className='grow my-1 py-2 px-3 input'
        autoComplete='off'
      />
    </div>
  );
}

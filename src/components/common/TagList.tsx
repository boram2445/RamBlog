type Props = {
  tags: string[];
  type?: 'small' | 'big';
};

export default function TagList({ tags, type = 'small' }: Props) {
  console.log(tags);

  return (
    <ul className='flex gap-2'>
      {tags?.map((tag, index) => (
        <li key={index}>
          <span
            className={`py-0.5 border border-gray-200 rounded-full hover:bg-gray-200 cursor-pointer ${
              type === 'small' ? 'text-xs px-2' : 'text-base px-3'
            }`}
          >
            {tag}
          </span>
        </li>
      ))}
    </ul>
  );
}

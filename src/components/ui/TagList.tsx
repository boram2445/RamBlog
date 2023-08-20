type Props = {
  tags: string[];
};

export default function TagList({ tags }: Props) {
  return (
    <ul className='flex gap-2'>
      {tags.map((tag, index) => (
        <li key={index}>
          <span className='py-0.5 px-2 text-xs border border-gray-200 rounded-full hover:bg-gray-200 cursor-pointer'>
            {tag}
          </span>
        </li>
      ))}
    </ul>
  );
}

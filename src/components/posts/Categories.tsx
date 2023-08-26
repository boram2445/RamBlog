type Props = {
  categories: string[];
  selected: string;
  onClick: (category: string) => void;
};

export default function Categories({ categories, selected, onClick }: Props) {
  return (
    <section className='py-5 px-3 flex flex-col items-center'>
      <h3 className='w-full text-center mb-3 px-3 pb-2.5 border-b font-semibold text-lg'>
        Cateogry
      </h3>
      <ul>
        {categories.map((category, index) => (
          <li
            key={index}
            className={`cursor-pointer`}
            onClick={() => onClick(category)}
          >
            {category}
          </li>
        ))}
      </ul>
    </section>
  );
}

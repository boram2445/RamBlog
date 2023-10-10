type Props = {
  title: string;
  description?: string;
};

export default function Title({ title, description }: Props) {
  return (
    <div className='ml-3 flex gap-4 items-baseline'>
      <h1 className='text-2xl tablet:text-3xl font-semibold '>{title}</h1>
      <span className='text-sm text-gray-400'>{description}</span>
    </div>
  );
}

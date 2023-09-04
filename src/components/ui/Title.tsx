type Props = {
  title: string;
  description: string;
};

export default function Title({ title, description }: Props) {
  return (
    <div className='flex gap-4 items-baseline'>
      <h1 className='text-3xl font-semibold '>{title}</h1>
      <span className='text-sm text-gray-400'>{description}</span>
    </div>
  );
}

type Props = {
  text: string;
};

export default function NoContent({ text }: Props) {
  return (
    <p className='text-gray-700 text-center dark:text-slate-300'>{text}</p>
  );
}

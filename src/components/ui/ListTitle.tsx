import { ReactNode } from 'react';

type Props = {
  icon?: ReactNode;
  title: string;
};

export default function ListTitle({ icon, title }: Props) {
  return (
    <div className="mb-8 pb-4 px-3 text-3xl laptop:text-4xl gap-2 text-gray-800 font-bold border-b border-gray-200 flex items-center dark:border-neutral-700 dark:text-slate-300">
      {icon}
      <h1>{title}</h1>
    </div>
  );
}

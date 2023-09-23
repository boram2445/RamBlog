type Props = {
  className: string;
};

export default function Skeleton({ className }: Props) {
  return (
    <div
      className={`bg-slate-200 motion-safe:animate-pulse rounded ${className} dark:bg-neutral-800`}
    />
  );
}

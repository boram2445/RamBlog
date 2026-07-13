import NoContent from "@/components/ui/NoContent";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="flex flex-col items-center justify-center gap-4">
        <NoContent text="존재하지 않는 사용자입니다" />
        <Link
          href="/"
          className="py-1 px-3 text-sm border rounded-full transition-all font-semibold bg-gray-800 hover:bg-gray-700 text-white dark:bg-slate-100 dark:text-neutral-800 dark:hover:opacity-80"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}

"use client";

import Button from "@/components/ui/Button";
import NoContent from "@/components/ui/NoContent";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="flex flex-col items-center justify-center gap-4">
        <NoContent text="오류가 발생했습니다" />
        <Button onClick={reset}>다시 시도</Button>
      </div>
    </div>
  );
}

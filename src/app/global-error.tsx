"use client";

import NoContent from "@/components/ui/NoContent";
import "./globals.css";
import Button from "@/components/ui/Button";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: Props) {
  return (
    <html lang="ko">
      <body className="h-screen">
        <div className="flex flex-col items-center justify-center h-full">
          <div className="flex flex-col items-center justify-center gap-4">
            <NoContent text="오류가 발생했습니다" />
            <Button onClick={reset}>다시 시도</Button>
          </div>
        </div>
      </body>
    </html>
  );
}

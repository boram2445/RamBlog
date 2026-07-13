import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

type RouteHandler = (req: NextRequest, context: any) => Promise<Response>;

export function withErrorHandler(handler: RouteHandler): RouteHandler {
  return async (req, context) => {
    try {
      return await handler(req, context);
    } catch (error) {
      if (error instanceof HttpError) {
        return NextResponse.json(
          { error: error.message },
          { status: error.status }
        );
      }

      if (error instanceof ZodError) {
        return NextResponse.json(
          { error: error.flatten().fieldErrors },
          { status: 400 }
        );
      }

      // 내부 에러 메시지는 클라이언트에 노출하지 않는다 (error.tsx와 동일한 원칙)
      console.error(error);
      return NextResponse.json(
        { error: "서버 오류가 발생했습니다" },
        { status: 500 }
      );
    }
  };
}

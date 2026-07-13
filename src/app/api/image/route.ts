import { uploadImage } from '@/service/image';
import { NextRequest, NextResponse } from "next/server";
import { withSessionUser } from '@/utils/session';
import { withErrorHandler, HttpError } from '@/lib/api-handler';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export const POST = withErrorHandler(async (req: NextRequest) => {
  return withSessionUser(async () => {
    const form = await req.formData();
    const file = form.get('file') as Blob;

    if (!file) {
      throw new HttpError(400, '파일을 선택해주세요.');
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      throw new HttpError(415, '지원하지 않는 파일 형식입니다.');
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new HttpError(413, '파일 크기가 너무 큽니다.');
    }

    return await uploadImage(file).then((data) => NextResponse.json(data));
  });
});

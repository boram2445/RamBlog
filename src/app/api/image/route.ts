import { uploadImage } from '@/service/image';
import { NextRequest, NextResponse } from "next/server";
import { withSessionUser } from '@/utils/session';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
  return withSessionUser(async () => {
    const form = await req.formData();
    const file = form.get('file') as Blob;

    if (!file) {
      return new Response('Bad request', { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return new Response('Unsupported Media Type', { status: 415 });
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return new Response('Payload Too Large', { status: 413 });
    }

    return await uploadImage(file).then((data) => NextResponse.json(data));
  });
}

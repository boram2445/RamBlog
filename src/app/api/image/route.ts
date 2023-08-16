import { uploadImage } from '@/service/image';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get('file') as Blob;

  if (!file) {
    return new Response('Bad request', { status: 400 });
  }

  return await uploadImage(file).then((data) => NextResponse.json(data));
}

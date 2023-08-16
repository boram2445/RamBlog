import { assetURL } from './sanity';

export async function uploadImage(file: Blob | File) {
  return await fetch(assetURL, {
    method: 'POST',
    headers: {
      'content-type': file.type,
      authorization: `Bearer ${process.env.SANITY_SECRET_TOKEN}`,
    },
    body: file,
  }).then((res) => res.json());
}
